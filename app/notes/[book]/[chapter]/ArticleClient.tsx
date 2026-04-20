"use client";

import Link from "next/link";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import { translateTag } from "@/lib/tags";

type NoteStub = { slug: string; titles: Partial<Record<Lang, string>>; chapter: number };

type Props = {
  bookSlug: string;
  bookTitle: string;
  chapterSlug: string;
  allNotes: NoteStub[];
  versions: Record<string, { title: string; tags: string[]; html: string; isFallback: boolean }>;
  availableLangs: Lang[];
  prev: { slug: string; titles: Partial<Record<Lang, string>> } | null;
  next: { slug: string; titles: Partial<Record<Lang, string>> } | null;
};

export default function ArticleClient({ bookSlug, bookTitle, chapterSlug, allNotes, versions, availableLangs, prev, next }: Props) {
  const { lang, t } = useLanguage();

  const version = versions[lang] ?? versions["zh-TW"];
  const isFallback = version && !availableLangs.includes(lang);

  const getTitle = (titles: Partial<Record<Lang, string>>) =>
    titles[lang] ?? titles["zh-TW"] ?? "";

  if (!version) return <div style={{ color: "#f00", padding: "24px" }}>找不到文章內容</div>;

  return (
    <main style={{ background: "#000", minHeight: "100vh", fontFamily: "monospace" }}>
      <div style={{ display: "flex", maxWidth: "1100px", margin: "0 auto" }}>

        {/* 側邊欄 */}
        <aside className="sidebar" style={{
          width: "220px", minWidth: "220px", padding: "24px 16px",
          borderRight: "1px solid #00ff4122",
          position: "sticky", top: 0, height: "100vh", overflowY: "auto",
        }}>
          <Link href={`/notes/${bookSlug}`} style={{ fontSize: "10px", color: "#00ff4188", textDecoration: "none", marginBottom: "16px", display: "block" }}>
            ← {bookTitle}
          </Link>
          <div style={{ fontSize: "9px", color: "#444", letterSpacing: "2px", marginBottom: "8px" }}>CHAPTERS</div>
          {allNotes.map((n, i) => (
            <Link key={n.slug} href={`/notes/${bookSlug}/${n.slug}`} style={{ textDecoration: "none" }}>
              <div style={{
                padding: "6px 8px", fontSize: "11px",
                color: n.slug === chapterSlug ? "#00ff41" : "#555",
                background: n.slug === chapterSlug ? "#00ff4111" : "transparent",
                borderLeft: n.slug === chapterSlug ? "2px solid #00ff41" : "2px solid transparent",
                cursor: "pointer", lineHeight: "1.5",
              }}>
                <span style={{ color: "#333", marginRight: "6px" }}>{String(i + 1).padStart(2, "0")}</span>
                {getTitle(n.titles)}
              </div>
            </Link>
          ))}
        </aside>

        {/* 文章內容 */}
        <article style={{ flex: 1, padding: "32px 40px", maxWidth: "680px" }}>
          <div style={{ fontSize: "10px", color: "#00ff4155", marginBottom: "24px" }}>
            <Link href="/notes" style={{ color: "#00ff4155", textDecoration: "none" }}>{t("notes.bookshelf")}</Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <Link href={`/notes/${bookSlug}`} style={{ color: "#00ff4155", textDecoration: "none" }}>{bookTitle}</Link>
          </div>

          {isFallback && (
            <div style={{ border: "1px solid #ff990033", background: "#ff990011", color: "#ff9900", padding: "8px 14px", fontSize: "11px", marginBottom: "20px" }}>
              ⚠ {t("notes.no_translation")}
            </div>
          )}

          <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "14px", color: "#00ff41", margin: "0 0 16px 0", lineHeight: "1.8" }}>
            {version.title}
          </h1>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "32px" }}>
            {version.tags.map(id => (
              <span key={id} style={{ fontSize: "10px", color: "#00ff4188", border: "1px solid #00ff4133", padding: "2px 8px" }}>
                {translateTag(id, lang)}
              </span>
            ))}
          </div>

          <div style={{ borderBottom: "1px solid #00ff4122", marginBottom: "32px" }} />

          <div className="prose" dangerouslySetInnerHTML={{ __html: version.html }} />

          <div style={{ borderTop: "1px solid #00ff4122", marginTop: "48px", paddingTop: "24px", display: "flex", justifyContent: "space-between" }}>
            {prev ? (
              <Link href={`/notes/${bookSlug}/${prev.slug}`} style={{ textDecoration: "none", color: "#00ff4188", fontSize: "11px" }}>
                ← {getTitle(prev.titles)}
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/notes/${bookSlug}/${next.slug}`} style={{ textDecoration: "none", color: "#00ff4188", fontSize: "11px" }}>
                {getTitle(next.titles)} →
              </Link>
            ) : <span />}
          </div>
        </article>
      </div>
    </main>
  );
}
