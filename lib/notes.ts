import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Lang } from "@/contexts/LanguageContext";

const NOTES_DIR = path.join(process.cwd(), "content/notes");
const SUPPORTED_LANGS: Lang[] = ["zh-TW", "en", "zh-CN"];

export type BookMeta = {
  slug: string;
  title: string;
  author: string;
  description: string;
  cover: string | null;
};

export type NoteMeta = {
  slug: string;
  bookSlug: string;
  availableLangs: Lang[];
  titles: Partial<Record<Lang, string>>;
  tags: Partial<Record<Lang, string[]>>;
  chapter: number;
  date: string;
};

export type NoteContent = {
  title: string;
  tags: string[];
  content: string;
  lang: Lang;
  isFallback: boolean;
};

export function getAllBooks(): BookMeta[] {
  const entries = fs.readdirSync(NOTES_DIR);
  const books: BookMeta[] = [];
  for (const entry of entries) {
    const dir = path.join(NOTES_DIR, entry);
    if (!fs.statSync(dir).isDirectory()) continue;
    const jsonPath = path.join(dir, "book.json");
    if (!fs.existsSync(jsonPath)) continue;
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    books.push({
      slug: entry,
      title: data.title ?? entry,
      author: data.author ?? "",
      description: data.description ?? "",
      cover: data.cover ?? null,
    });
  }
  return books;
}

export function getNotesByBook(bookSlug: string): NoteMeta[] {
  const bookDir = path.join(NOTES_DIR, bookSlug);
  if (!fs.existsSync(bookDir)) return [];

  const entries = fs.readdirSync(bookDir).filter(e => {
    const p = path.join(bookDir, e);
    return fs.statSync(p).isDirectory();
  });

  return entries.map(slug => {
    const noteDir = path.join(bookDir, slug);
    const availableLangs: Lang[] = [];
    const titles: Partial<Record<Lang, string>> = {};
    const tags: Partial<Record<Lang, string[]>> = {};
    let chapter = 0;
    let date = "";

    for (const lang of SUPPORTED_LANGS) {
      const filePath = path.join(noteDir, `${lang}.md`);
      if (!fs.existsSync(filePath)) continue;
      availableLangs.push(lang);
      const { data } = matter(fs.readFileSync(filePath, "utf-8"));
      titles[lang] = data.title ?? slug;
      tags[lang] = data.tags ?? [];
      if (data.chapter) chapter = data.chapter;
      if (data.date) date = data.date;
    }

    return { slug, bookSlug, availableLangs, titles, tags, chapter, date };
  }).sort((a, b) => a.chapter - b.chapter);
}

export function getAllNotes(): NoteMeta[] {
  return getAllBooks().flatMap(b => getNotesByBook(b.slug));
}

export function getNoteContent(bookSlug: string, noteSlug: string, lang: Lang): NoteContent | null {
  const noteDir = path.join(NOTES_DIR, bookSlug, noteSlug);
  if (!fs.existsSync(noteDir)) return null;

  const tryLang = (l: Lang): NoteContent | null => {
    const filePath = path.join(noteDir, `${l}.md`);
    if (!fs.existsSync(filePath)) return null;
    const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));
    return {
      title: data.title ?? noteSlug,
      tags: data.tags ?? [],
      content,
      lang: l,
      isFallback: l !== lang,
    };
  };

  return tryLang(lang) ?? tryLang("zh-TW") ?? null;
}
