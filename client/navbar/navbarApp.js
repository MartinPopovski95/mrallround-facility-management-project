document.addEventListener('DOMContentLoaded', function() {
  const langToggles = document.querySelectorAll('input[name="lang"]');



  const savedLang = localStorage.getItem('selectedLanguage') || 'en';


  const savedButton = savedLang === 'en' ? 'eng' : 'ger';
  if (document.getElementById(savedButton)) {
    document.getElementById(savedButton).checked = true;
  }


  if (typeof applyTranslations === 'function') {
    applyTranslations(savedLang);
  }


  langToggles.forEach(toggle => {
    toggle.addEventListener('change', function() {
      if (this.checked) {
        localStorage.setItem('selectedLanguage', this.value);


        if (typeof applyTranslations === 'function') {
          applyTranslations(this.value);
        }
      }
    });
  });
});