
import API_CONFIG from '../../../../config.js';

let formConfig = null;
let currentServiceType = null;


export function initServiceForm() {
	const modal = document.getElementById('serviceFormModal');
	const openBtn = document.getElementById('openServiceFormBtn');
	const closeBtn = document.getElementById('closeServiceFormBtn');
	const cancelBtn = document.getElementById('cancelFormBtn');
	const form = document.getElementById('serviceRequestForm');
	const loadingState = document.getElementById('formLoadingState');
	const dynamicFieldsContainer = document.getElementById('dynamic-form-fields');
	const successModal = document.getElementById('successModal');
	const closeSuccessBtn = document.getElementById('closeSuccessBtn');


	if (!modal || !form || !dynamicFieldsContainer) {
		return;
	}


	function detectServiceType() {
		const path = window.location.pathname.toLowerCase();


		if (path.includes('cleaning')) {
			return 'cleaning-service';
		} else if (path.includes('disposal')) {
			return 'disposal-service';
		} else if (path.includes('maintenance')) {
			return 'maintenance-service';
		} else if (path.includes('relocation')) {
			return 'relocation-service';
		} else if (path.includes('renovation')) {
			return 'renovation-service';
		}


		const title = document.title.toLowerCase();
		if (title.includes('cleaning')) {
			return 'cleaning-service';
		} else if (title.includes('disposal')) {
			return 'disposal-service';
		} else if (title.includes('maintenance') || title.includes('property')) {
			return 'maintenance-service';
		} else if (title.includes('relocation')) {
			return 'relocation-service';
		} else if (title.includes('renovation')) {
			return 'renovation-service';
		}


		return 'cleaning-service';
	}


	async function fetchFormConfig(serviceType) {
		try {
			const url = `${API_CONFIG.STRAPI_URL}/api/${serviceType}?populate[requestFormFields]=*`;

			const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch form config: ${response.status}`);
			}

			const data = await response.json();

			const fields = data.data?.requestFormFields || [];
			return fields;
		} catch (error) {
			return [];
		}
	}


	function renderDynamicFields(fields) {
		dynamicFieldsContainer.innerHTML = '';

		if (!fields || fields.length === 0) {
			return;
		}


		const section = document.createElement('div');
		section.className = 'form-section';

		const formRow = document.createElement('div');
		formRow.className = 'form-row';

		fields.forEach((field, index) => {
			const fieldGroup = createFormField(field);
			formRow.appendChild(fieldGroup);


			if ((index + 1) % 2 === 0 && index !== fields.length - 1) {
				section.appendChild(formRow.cloneNode(true));
				formRow.innerHTML = '';
			}
		});


		if (formRow.children.length > 0) {
			section.appendChild(formRow);
		}

		dynamicFieldsContainer.appendChild(section);
	}


	function createFormField(field) {
		const formGroup = document.createElement('div');
		formGroup.className = 'form-group';

		const label = document.createElement('label');
		label.setAttribute('for', `field_${field.fieldLabel}`);
		label.textContent = field.fieldLabel;
		formGroup.appendChild(label);

		const input = document.createElement('input');
		input.type = 'text';
		input.id = `field_${field.fieldLabel}`;
		input.name = field.fieldLabel;

		formGroup.appendChild(input);
		return formGroup;
	}


	function collectDynamicFieldsData() {
		const data = {};

		if (!formConfig || formConfig.length === 0) {
			return data;
		}

		formConfig.forEach(field => {
			const input = document.getElementById(`field_${field.fieldLabel}`);
			if (input) {
				data[field.fieldLabel] = input.value;
			}
		});

		return data;
	}


	async function submitToStrapi(data) {
		try {
			const response = await fetch(`${API_CONFIG.STRAPI_URL}/api/form-submissions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ data })
			});

			if (!response.ok) {
				throw new Error(`Strapi submission failed: ${response.status}`);
			}

			const result = await response.json();
			return result.data;
		} catch (error) {
			throw error;
		}
	}


	async function triggerEmailNotification(submissionId) {
		try {
			const response = await fetch(`${API_CONFIG.BASE_URL}/api/service-requests/send-email`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ submissionId })
			});
		} catch (error) {

		}
	}


	async function openModal() {
		modal.classList.add('show');
		document.body.style.overflow = 'hidden';


		loadingState.style.display = 'flex';
		form.style.display = 'none';


		currentServiceType = detectServiceType();


		formConfig = await fetchFormConfig(currentServiceType);
		renderDynamicFields(formConfig);


		loadingState.style.display = 'none';
		form.style.display = 'block';


		setTimeout(() => {
			const firstInput = form.querySelector('input');
			if (firstInput) {
				firstInput.focus();
			}
		}, 100);
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


	if (openBtn) {
		openBtn.addEventListener('click', openModal);
	}

	if (closeBtn) {
		closeBtn.addEventListener('click', closeModal);
	}

	if (cancelBtn) {
		cancelBtn.addEventListener('click', closeModal);
	}


	modal.addEventListener('click', function (event) {
		if (event.target === modal) {
			closeModal();
		}
	});


	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape' && modal.classList.contains('show')) {
			closeModal();
		}
		if (event.key === 'Escape' && successModal && successModal.classList.contains('show')) {
			closeSuccessModal();
		}
	});


	if (closeSuccessBtn) {
		closeSuccessBtn.addEventListener('click', closeSuccessModal);
	}


	if (successModal) {
		successModal.addEventListener('click', function (event) {
			if (event.target === successModal) {
				closeSuccessModal();
			}
		});
	}


	if (form) {
		form.addEventListener('submit', async function (event) {
			event.preventDefault();


			if (!form.checkValidity()) {
				form.reportValidity();
				return;
			}


			const submitBtn = form.querySelector('button[type="submit"]');
			const originalText = submitBtn.textContent;
			submitBtn.disabled = true;
			submitBtn.textContent = 'Submitting...';

			try {

				const fixedData = {
					fullName: document.getElementById('fullName').value,
					email: document.getElementById('email').value,
					phone: document.getElementById('phone').value,
					fromDate: document.getElementById('fromDate').value,
					toDate: document.getElementById('toDate').value
				};


				const customFieldsData = collectDynamicFieldsData();


				const submissionData = {
					serviceType: currentServiceType,
					...fixedData,
					customFieldsData,
					submittedAt: new Date().toISOString(),
					emailSent: false
				};


				const submission = await submitToStrapi(submissionData);


				if (submission && submission.id) {
					await triggerEmailNotification(submission.id);
				}


				closeModal();
				openSuccessModal();
			} catch (error) {
				alert('There was an error submitting your request. Please try again or contact us directly.');
			} finally {

				submitBtn.disabled = false;
				submitBtn.textContent = originalText;
			}
		});
	}
}
