"use client";

import { createContext, useContext, useEffect, useState } from "react";
import zhTW from "@/locales/zh-TW.json";
import en from "@/locales/en.json";
import zhCN from "@/locales/zh-CN.json";

export type Lang = "zh-TW" | "en" | "zh-CN";

const LOCALES: Record<Lang, Record<string, string>> = { "zh-TW": zhTW, en, "zh-CN": zhCN };

const LABELS: Record<Lang, string> = { "zh-TW": "繁中", en: "EN", "zh-CN": "简中" };

function detectLang(): Lang {
  const nav = typeof navigator !== "undefined" ? navigator.language : "";
  if (nav.startsWith("zh-TW") || nav.startsWith("zh-HK")) return "zh-TW";
  if (nav.startsWith("zh")) return "zh-CN";
  return "en";
}

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  labels: Record<Lang, string>;
  langs: Lang[];
};

const LanguageContext = createContext<LangCtx>({
  lang: "zh-TW",
  setLang: () => {},
  t: k => k,
  labels: LABELS,
  langs: ["zh-TW", "en", "zh-CN"],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh-TW");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    setLangState(stored ?? detectLang());
    setMounted(true);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const t = (key: string) => LOCALES[lang][key] ?? LOCALES["zh-TW"][key] ?? key;

  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, labels: LABELS, langs: ["zh-TW", "en", "zh-CN"] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
