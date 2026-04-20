import Link from "next/link";
import { getAllBooks, getNotesByBook, getNoteContent } from "@/lib/notes";
import { notFound } from "next/navigation";
import { remark } from "remark";
import remarkHtml from "remark-html";
import ArticleClient from "./ArticleClient";

export async function generateStaticParams() {
  const books = getAllBooks();
  return books.flatMap(b =>
    getNotesByBook(b.slug).map(n => ({ book: b.slug, chapter: n.slug }))
  );
}

async function renderMarkdown(content: string): Promise<string> {
  const result = await remark().use(remarkHtml).process(content);
  return result.toString();
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ book: string; chapter: string }>;
}) {
  const { book: bookSlug, chapter: chapterSlug } = await params;

  const books = getAllBooks();
  const book = books.find(b => b.slug === bookSlug);
  if (!book) notFound();

  const allNotes = getNotesByBook(bookSlug);
  const noteMeta = allNotes.find(n => n.slug === chapterSlug);
  if (!noteMeta) notFound();

  const currentIndex = allNotes.findIndex(n => n.slug === chapterSlug);
  const prev = currentIndex > 0 ? allNotes[currentIndex - 1] : null;
  const next = currentIndex < allNotes.length - 1 ? allNotes[currentIndex + 1] : null;

  // 預先渲染所有可用語言的 HTML
  const versions: Record<string, { title: string; tags: string[]; html: string; isFallback: boolean }> = {};
  for (const lang of noteMeta.availableLangs) {
    const content = getNoteContent(bookSlug, chapterSlug, lang);
    if (content) {
      const html = await renderMarkdown(content.content);
      versions[lang] = { title: content.title, tags: content.tags, html, isFallback: false };
    }
  }
  // 確保至少有 zh-TW fallback
  if (!versions["zh-TW"]) {
    const fallback = getNoteContent(bookSlug, chapterSlug, "zh-TW");
    if (fallback) {
      versions["zh-TW"] = { title: fallback.title, tags: fallback.tags, html: await renderMarkdown(fallback.content), isFallback: false };
    }
  }

  return (
    <ArticleClient
      bookSlug={bookSlug}
      bookTitle={book.title}
      chapterSlug={chapterSlug}
      allNotes={allNotes.map(n => ({ slug: n.slug, titles: n.titles, chapter: n.chapter }))}
      versions={versions}
      availableLangs={noteMeta.availableLangs}
      prev={prev ? { slug: prev.slug, titles: prev.titles } : null}
      next={next ? { slug: next.slug, titles: next.titles } : null}
    />
  );
}
