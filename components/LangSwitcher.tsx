"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LangSwitcher() {
  const { lang, setLang, langs, labels } = useLanguage();

  return (
    <div style={{ display: "flex", gap: "4px", fontFamily: "monospace", fontSize: "10px" }}>
      {langs.map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            padding: "3px 8px",
            border: `1px solid ${lang === l ? "#00ff41" : "#00ff4133"}`,
            background: lang === l ? "#00ff4122" : "transparent",
            color: lang === l ? "#00ff41" : "#00ff4166",
            cursor: "pointer",
          }}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
