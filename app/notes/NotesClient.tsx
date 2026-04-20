"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import { translateTag, translateTags } from "@/lib/tags";

type BookMeta = {
  slug: string;
  title: string;
  author: string;
  description: string;
  cover: string | null;
};

type NoteMeta = {
  slug: string;
  bookSlug: string;
  titles: Partial<Record<Lang, string>>;
  tags: Partial<Record<Lang, string[]>>;
  availableLangs: Lang[];
};

function AsciiCover({ title }: { title: string }) {
  const words = title.split(" ");
  return (
    <div style={{
      width: "100%", aspectRatio: "2/3", background: "#0a0a0a",
      border: "1px solid #00ff4144", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", fontFamily: "monospace",
      color: "#00ff4188", gap: "4px", padding: "8px", boxSizing: "border-box",
    }}>
      <div>┌────────┐</div>
      <div>│        │</div>
      {words.map((w, i) => <div key={i} style={{ color: "#00ff41", fontSize: "9px" }}>{w.slice(0, 8)}</div>)}
      <div>│        │</div>
      <div>└────────┘</div>
    </div>
  );
}

const btnStyle = (active: boolean): React.CSSProperties => ({
  border: `1px solid ${active ? "#00ff41" : "#00ff4133"}`,
  background: active ? "#00ff4122" : "transparent",
  color: active ? "#00ff41" : "#aaffcc",
  padding: "3px 10px", cursor: "pointer", fontSize: "11px", fontFamily: "monospace",
});

export default function NotesClient({ books, notes }: { books: BookMeta[]; notes: NoteMeta[] }) {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const getTitle = (titles: Partial<Record<Lang, string>>) => titles[lang] ?? titles["zh-TW"] ?? "";
  const getTagIds = (tags: Partial<Record<Lang, string[]>>) => tags["zh-TW"] ?? [];

  const allTagIds = [...new Set(notes.flatMap(n => getTagIds(n.tags)))];
  const isSearching = search.trim() !== "" || selectedTag !== "";

  const filteredNotes = notes.filter(n => {
    const title = getTitle(n.titles);
    const tagIds = getTagIds(n.tags);
    if (selectedTag && !tagIds.includes(selectedTag)) return false;
    if (search && !title.includes(search) && !tagIds.some(id => translateTag(id, lang).includes(search))) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link href="/" style={{ color: "#00ff4188", fontSize: "11px", textDecoration: "none" }}>{t("notes.back")}</Link>
        <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "14px", color: "#00ff41", margin: 0 }}>
          {t("notes.bookshelf")}
        </h1>
      </div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={t("notes.search")}
        style={{
          width: "100%", padding: "8px 12px", marginBottom: "12px",
          background: "#111", border: "1px solid #00ff4144",
          color: "#00ff41", fontFamily: "monospace", fontSize: "13px",
          boxSizing: "border-box", outline: "none",
        }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "28px" }}>
        <span style={{ fontSize: "10px", color: "#555", alignSelf: "center", fontFamily: "monospace" }}>{t("notes.tags")}：</span>
        <button style={btnStyle(!selectedTag)} onClick={() => setSelectedTag("")}>{t("notes.all")}</button>
        {allTagIds.map(id => (
          <button key={id} style={btnStyle(selectedTag === id)} onClick={() => setSelectedTag(id === selectedTag ? "" : id)}>
            {translateTag(id, lang)}
          </button>
        ))}
      </div>

      {isSearching ? (
        <div>
          <div style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", marginBottom: "16px" }}>
            {filteredNotes.length} {t("notes.chapters")}
          </div>
          {filteredNotes.map(note => (
            <Link key={`${note.bookSlug}/${note.slug}`} href={`/notes/${note.bookSlug}/${note.slug}`} style={{ textDecoration: "none" }}>
              <div
                style={{ padding: "10px 16px", marginBottom: "6px", border: "1px solid #00ff4122", color: "#ddd", fontSize: "13px", cursor: "pointer", fontFamily: "monospace" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#00ff41"; el.style.color = "#00ff41"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#00ff4122"; el.style.color = "#ddd"; }}
              >
                {getTitle(note.titles)}
                <span style={{ float: "right", fontSize: "10px", color: "#555" }}>
                  {translateTags(getTagIds(note.tags).slice(0, 2), lang).join(", ")}
                </span>
              </div>
            </Link>
          ))}
          {filteredNotes.length === 0 && (
            <div style={{ color: "#444", textAlign: "center", marginTop: "40px", fontFamily: "monospace" }}>{t("notes.no_results")}</div>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "24px" }}>
          {books.map(book => (
            <Link key={book.slug} href={`/notes/${book.slug}`} style={{ textDecoration: "none" }}>
              <div
                style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: "8px" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = "0.7"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = "1"}
              >
                {book.cover ? (
                  <img src={`/covers/${book.cover}`} alt={book.title}
                    style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", border: "1px solid #00ff4133" }} />
                ) : (
                  <AsciiCover title={book.title} />
                )}
                <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#aaffcc", lineHeight: "1.4" }}>{book.title}</div>
                {book.author && <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#00ff4155" }}>{book.author}</div>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
