import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { en } from "./locales/en";
import { ja } from "./locales/ja";

export const resources = {
  en: {
    translation: en,
  },
  ja: {
    translation: ja,
  },
} as const;

export type Resources = typeof resources;

export const defaultNS = "translation";
export const fallbackLng = "ja";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,
    defaultNS,
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    debug: process.env.NODE_ENV === "development",
    load: "languageOnly",
    saveMissing: process.env.NODE_ENV === "development",
    react: {
      useSuspense: false,
    },
  })
  .catch((error) => {
    console.error("Error initializing i18n:", error);
  });

if (typeof window !== "undefined" && !localStorage.getItem("i18nextLng")) {
  localStorage.setItem("i18nextLng", "ja");
}

export default i18n;
