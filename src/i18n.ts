import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, id } from "./lang";

const savedLanguage = localStorage.getItem("i18nextLng") || "en";

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    id: {
      translation: id,
    },
  },
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

i18next.on("languageChanged", (lng) => {
  localStorage.setItem("i18nextLng", lng);
});

export default i18next;
