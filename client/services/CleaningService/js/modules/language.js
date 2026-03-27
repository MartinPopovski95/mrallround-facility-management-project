import { translations } from "./translations.js";

export function applyTranslations(locale) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[locale] && translations[locale][key]) {
      el.textContent = translations[locale][key];
    }
  });
}

export function initLanguageSwitch(loadFn) {
  const savedLang = localStorage.getItem("selectedLanguage") || "en";
  const engBtn = document.getElementById("eng");
  const gerBtn = document.getElementById("ger");

  if (engBtn && gerBtn) {
    engBtn.checked = savedLang === "en";
    gerBtn.checked = savedLang === "de";

    engBtn.addEventListener("change", () => engBtn.checked && loadFn("en"));
    gerBtn.addEventListener("change", () => gerBtn.checked && loadFn("de"));
  }

  loadFn(savedLang);
}
