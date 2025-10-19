import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translation from "./locales/ar/translation.json";

// 🔄 function to build resources dynamically from translation.json
const buildResources = (lang) => {
  return Object.fromEntries(
    Object.entries(translation).map(([key, value]) => [
      key,
      typeof value === "object" && lang in value ? value[lang] : value,
    ])
  );
};
const savedLang = localStorage.getItem("lang") || "ar";
// ✅ init i18n
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: buildResources("en") },
    ar: { translation: buildResources("ar") },
  },
  // lng: "ar", // 👈 اللغة الافتراضية
  lng: savedLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// ✅ تغيير اتجاه الصفحة حسب اللغة
i18n.on("languageChanged", (lng) => {
  if (lng === "ar") {
    document.body.setAttribute("dir", "rtl");
  } else {
    document.body.setAttribute("dir", "ltr");
  }
});

export default i18n;
