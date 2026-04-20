"use client";

import Link from "next/link";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import { translateTags } from "@/lib/tags";

type NoteMeta = {
  slug: string;
  bookSlug: string;
  titles: Partial<Record<Lang, string>>;
  tags: Partial<Record<Lang, string[]>>;
};

export default function ChapterList({ notes, bookSlug }: { notes: NoteMeta[]; bookSlug: string }) {
  const { lang, t } = useLanguage();

  const getTitle = (titles: Partial<Record<Lang, string>>) => titles[lang] ?? titles["zh-TW"] ?? "";
  const getTagIds = (tags: Partial<Record<Lang, string[]>>) => tags["zh-TW"] ?? [];

  return (
    <div>
      {notes.map((note, i) => (
        <Link key={note.slug} href={`/notes/${bookSlug}/${note.slug}`} style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "flex", alignItems: "baseline", gap: "12px",
              padding: "12px 16px", marginBottom: "4px",
              border: "1px solid #00ff4122", color: "#ccc", cursor: "pointer",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = "#00ff41"; el.style.color = "#00ff41"; el.style.background = "#00ff4108";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = "#00ff4122"; el.style.color = "#ccc"; el.style.background = "transparent";
            }}
          >
            <span style={{ color: "#00ff4144", fontSize: "11px", minWidth: "28px", fontFamily: "monospace" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ flex: 1, fontSize: "13px", fontFamily: "monospace" }}>{getTitle(note.titles)}</span>
            <span style={{ fontSize: "10px", color: "#444", fontFamily: "monospace" }}>
              {translateTags(getTagIds(note.tags).slice(0, 2), lang).join(" · ")}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
