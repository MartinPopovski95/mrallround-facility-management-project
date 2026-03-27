import { fetchCleaningServiceData } from "./api.js";
import { renderCleaningServiceData, setLoading } from "./render.js";
import { applyTranslations, initLanguageSwitch } from "./language.js";
import { DynamicFormHandler } from "../../../components/shared/formHandler.js";

const formHandler = new DynamicFormHandler('Cleaning', '/api/cleaning-service');

async function loadCleaningService(locale = "en") {
  setLoading(true);
  try {
    const data = await fetchCleaningServiceData(locale);
    renderCleaningServiceData(data);
    applyTranslations(locale);
    localStorage.setItem("selectedLanguage", locale);

    await formHandler.initialize(locale);
    formHandler.renderFormFields('dynamicFormFields');

  } catch (err) {
    if (locale !== "en") {
      loadCleaningService("en");
    }
  } finally {
    setLoading(false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initLanguageSwitch(loadCleaningService);

});
