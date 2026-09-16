import enTranslation from "@/locale/en.json";
import frTranslation from "@/locale/fr.json";

export type Dictionary = typeof frTranslation;

const dictionaries: Record<string, Dictionary> = {
  en: enTranslation as unknown as Dictionary,
  fr: frTranslation as unknown as Dictionary,
};

export const getDictionary = (locale: string): Dictionary => {
  return dictionaries[locale] || dictionaries.fr;
};
