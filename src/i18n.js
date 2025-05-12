import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en/translation.json";
import viTranslation from "./locales/vi/translation.json";
import jaTranslation from "./locales/ja/translation.json";
import zhTranslation from "./locales/zh/translation.json";
import koTranslation from "./locales/ko/translation.json";
import frTranslation from "./locales/fr/translation.json";
import ruTranslation from "./locales/ru/translation.json";
import saTranslation from "./locales/sa/translation.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  vi: {
    translation: viTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
  ko: {
    translation: koTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  ru: {
    translation: ruTranslation,
  },
  sa: {
    translation: saTranslation,
  },
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    debug: false,
    keySeparator: ".",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// Lưu i18n instance vào window object để có thể truy cập từ bất kỳ đâu
if (typeof window !== "undefined") {
  window.i18n = i18n;
  console.log("Saved i18n instance to window object");
}

export default i18n;
