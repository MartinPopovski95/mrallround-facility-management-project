import { API_CONFIG } from '../../../config.js';

export class DynamicFormHandler {
    constructor(serviceType, apiEndpoint) {
        this.serviceType = serviceType;
        this.apiEndpoint = apiEndpoint;
        this.formFields = [];
    }

    /**
     * Initialize the form handler by fetching form configuration from Strapi
     * @param {string} locale - The locale to fetch form fields for
     */
    async initialize(locale = 'en') {
        try {
            const API_URL = API_CONFIG.getApiUrl(this.apiEndpoint);

            const response = await fetch(`${API_URL}?locale=${locale}&populate=deep`);
            if (!response.ok) throw new Error(`Failed to fetch form config: ${response.status}`);

            const data = await response.json();

            this.formFields = data.requestFormFields || data.data?.attributes?.requestFormFields || [];

            this.formFields = this.formFields.map(field => ({
                ...field,
                fieldName: field.fieldName || this.generateFieldName(field.fieldLabel)
            }));

            return this.formFields;
        } catch (error) {
            return [];
        }
    }

    /**
     * Generate a safe field name from a label
     * @param {string} label - The field label
     * @returns {string} Safe field name
     */
    generateFieldName(label) {
        return label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');
    }

    /**
     * Render dynamic form fields into a container
     * @param {string} containerId - The ID of the container element
     */
    renderFormFields(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        if (!this.formFields || this.formFields.length === 0) {
            return;
        }

        container.innerHTML = '';

        const section = document.createElement('div');
        section.className = 'form-section';

        const heading = document.createElement('h3');
        heading.setAttribute('data-i18n', 'additionalDetails');
        heading.textContent = 'Additional Details';
        section.appendChild(heading);

        let currentRow = null;
        this.formFields.forEach((field, index) => {
            if (!field.fieldLabel) {
                return;
            }

            const fieldName = field.fieldName || this.generateFieldName(field.fieldLabel);

            if (index % 2 === 0) {
                currentRow = document.createElement('div');
                currentRow.className = 'form-row';
                section.appendChild(currentRow);
            }

            const fieldGroup = document.createElement('div');
            fieldGroup.className = 'form-group';

            const label = document.createElement('label');
            label.setAttribute('for', fieldName);
            label.textContent = field.fieldLabel;

            const input = document.createElement('input');
            input.type = 'text';
            input.id = fieldName;
            input.name = fieldName;
            input.className = 'form-control';
            input.required = true;

            fieldGroup.appendChild(label);
            fieldGroup.appendChild(input);
            currentRow.appendChild(fieldGroup);
        });

        container.appendChild(section);
    }

    /**
     * Collect form data including dynamic fields
     * @param {HTMLFormElement} form - The form element
     * @returns {Object} Form data object
     */
    collectFormData(form) {
        const formData = new FormData(form);

        const knownFields = ['fullName', 'email', 'phone'];

        const labelMap = {
            'fromDate': 'From Date',
            'toDate': 'To Date',
            'comments': 'Comments'
        };

        const data = {
            serviceType: this.serviceType,
            submittedAt: new Date().toISOString(),
            customFieldsData: {}
        };

        for (const [key, value] of formData.entries()) {
            if (knownFields.includes(key)) {
                data[key] = value;
            } else {
                let fieldLabel;

                if (labelMap[key]) {
                    fieldLabel = labelMap[key];
                } else {
                    let field = this.formFields.find(f => f.fieldName === key);

                    if (!field) {
                        field = this.formFields.find(f => {
                            const generatedName = this.generateFieldName(f.fieldLabel);
                            return generatedName === key;
                        });
                    }

                    fieldLabel = (field && field.fieldLabel) ? field.fieldLabel : key;
                }

                if (value && value.trim() !== '') {
                    data.customFieldsData[fieldLabel] = value;
                }
            }
        }

        return data;
    }

    /**
     * Submit form data to the backend
     * @param {Object} formData - The form data to submit
     * @returns {Promise} Submission response
     */
    async submitForm(formData) {
        try {
            const submitUrl = API_CONFIG.getApiUrl('/api/service-requests');

            const response = await fetch(submitUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Submission failed');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}
