import { fetchRelocationServiceData } from "./api.js";
import { renderRelocationServiceData, setLoading } from "./render.js";
import { applyTranslations, initLanguageSwitch } from "./language.js";
import { DynamicFormHandler } from "../../../components/shared/formHandler.js";

const formHandler = new DynamicFormHandler('Relocation', '/api/relocation-service');

async function loadComponent(componentPath, targetId) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
    const html = await response.text();
    const target = document.getElementById(targetId);
    if (target) target.innerHTML = html;
  } catch (error) {
  }
}

async function loadRelocationService(locale = "en") {
  setLoading(true);
  try {
    const data = await fetchRelocationServiceData(locale);
    renderRelocationServiceData(data);
    applyTranslations(locale);
    localStorage.setItem("selectedLanguage", locale);

    await formHandler.initialize(locale);
    formHandler.renderFormFields('dynamicFormFields');

    applyTranslations(locale);

  } catch (err) {
    if (locale !== "en") {
      loadRelocationService("en");
    }
  } finally {
    setLoading(false);
  }
}

function initServiceFormModal() {
  const modal = document.getElementById('serviceFormModal');
  const openBtn = document.getElementById('openServiceFormBtn');
  const closeBtn = document.getElementById('closeServiceFormBtn');
  const cancelBtn = document.getElementById('cancelFormBtn');
  const form = document.getElementById('serviceRequestForm');
  const successModal = document.getElementById('successModal');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');

  if (!modal || !openBtn || !form) {
    return;
  }

  function openModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const firstInput = form.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 300);
  }

  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    form.reset();
  }

  function openSuccessModal() {
    if (successModal) {
      successModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSuccessModal() {
    if (successModal) {
      successModal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', closeSuccessModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) closeSuccessModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
    if (e.key === 'Escape' && successModal && successModal.classList.contains('show')) {
      closeSuccessModal();
    }
  });

  return { closeModal, openSuccessModal };
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent('../components/services-cta/services-cta.html', 'cta-component');

  const modalControls = initServiceFormModal();

  initLanguageSwitch(loadRelocationService);

  const form = document.getElementById('serviceRequestForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      try {
        const formData = formHandler.collectFormData(form);
        const result = await formHandler.submitForm(formData);

        if (modalControls) {
          modalControls.closeModal();
          modalControls.openSuccessModal();
        }
      } catch (error) {
        alert('There was an error submitting your request. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
});
