import { API_CONFIG } from '../config.js';

document.addEventListener("DOMContentLoaded", function () {
	const langToggles = document.querySelectorAll('input[name="lang"]');

	const savedLang = localStorage.getItem("selectedLanguage") || "en";
	const langValue = savedLang === "en" ? "en" : "de";

	document.getElementById(savedLang).checked = true;

	applyCareerTranslations(langValue);

	langToggles.forEach((toggle) => {
		toggle.addEventListener("change", function () {
			if (this.checked) {
				const lang = this.id === "en" ? "en" : "de";
				localStorage.setItem("selectedLanguage", this.id);
				applyCareerTranslations(lang);
			}
		});
	});

	document.getElementById("phoneCode").value = "+41";

	const form = document.getElementById("applicationForm");
	form.addEventListener("submit", handleCareerFormSubmit);
});

const fileInput = document.querySelector('input[type="file"]');
const fileLabel = document.querySelector(".file-custom");

if (fileInput && fileLabel) {
	fileInput.addEventListener("change", function () {
		if (this.files && this.files.length > 0) {
			fileLabel.textContent = this.files[0].name;
			fileLabel.style.color = "var(--accent)";
		} else {
			fileLabel.textContent = "Upload a file";
			fileLabel.style.color = "var(--gray)";
		}
	});
}

async function handleCareerFormSubmit(e) {
	e.preventDefault();

	const form = e.target;
	const fd = new FormData(form);
	const submitBtn = form.querySelector(".submit-btn");

	// Debug: Log form data
	for (let [key, value] of fd.entries()) {
	}

	submitBtn.disabled = true;
	submitBtn.textContent = "Sending...";

	try {
		const response = await fetch(
			`${API_CONFIG.BASE_URL}/api/career/apply`,
			{
				method: "POST",
				body: fd,
			}
		);

		if (!response.ok) {
			const err = await response
				.json()
				.catch(() => ({ message: "Unknown error" }));
			const errorMsg = err.message || response.statusText;
			showFormMessage(`Submission failed: ${errorMsg}`, "error");
			submitBtn.disabled = false;
			submitBtn.textContent = "Submit Application";
			return;
		}

		const result = await response.json();
		form.reset();
		showFormMessage("Application sent successfully!", "success");
	} catch (err) {
		showFormMessage("Network error while submitting application.", "error");
	} finally {
		submitBtn.disabled = false;
		submitBtn.textContent = "Submit Application";
	}
}

function showFormMessage(message, type = "success") {
	const msg = document.createElement("div");
	msg.className = `form-message ${type}`;
	msg.textContent = message;
	document.body.appendChild(msg);

	setTimeout(() => msg.classList.add("visible"), 10);

	setTimeout(() => {
		msg.classList.remove("visible");
		setTimeout(() => msg.remove(), 400);
	}, 3000);
}
