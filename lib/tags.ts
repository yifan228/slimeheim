import tagsData from "@/locales/tags.json";
import type { Lang } from "@/contexts/LanguageContext";

type TagMap = Record<string, Record<string, string>>;
const TAGS = tagsData as TagMap;

export function translateTag(id: string, lang: Lang): string {
  return TAGS[id]?.[lang] ?? TAGS[id]?.["zh-TW"] ?? id;
}

export function translateTags(ids: string[], lang: Lang): string[] {
  return ids.map(id => translateTag(id, lang));
}
