"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

type Props = {
  bookTitle: string;
  author: string;
  description: string;
  noteCount: number;
};

export default function BookHeader({ bookTitle, author, description, noteCount }: Props) {
  const { t } = useLanguage();

  return (
    <>
      <div style={{ fontSize: "11px", color: "#00ff4188", marginBottom: "24px" }}>
        <Link href="/" style={{ color: "#00ff4188", textDecoration: "none" }}>
          {t("notes.back").replace("←", "").trim()}
        </Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link href="/notes" style={{ color: "#00ff4188", textDecoration: "none" }}>{t("notes.bookshelf")}</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "#00ff41" }}>{bookTitle}</span>
      </div>

      <div style={{ borderLeft: "3px solid #00ff41", paddingLeft: "16px", marginBottom: "40px" }}>
        <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "13px", color: "#00ff41", margin: "0 0 10px 0" }}>
          {bookTitle}
        </h1>
        {author && <div style={{ fontSize: "11px", color: "#00ff4177", marginBottom: "6px" }}>{author}</div>}
        {description && <div style={{ fontSize: "12px", color: "#aaa" }}>{description}</div>}
      </div>

      <div style={{ fontSize: "10px", color: "#555", letterSpacing: "2px", marginBottom: "12px", fontFamily: "monospace" }}>
        CHAPTERS — {noteCount} {t("notes.chapters")}
      </div>
    </>
  );
}
