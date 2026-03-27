import { API_CONFIG } from '../../../config.js';

const API_BASE_URL = `${API_CONFIG.BASE_URL}/api/calculator`;

/**
 * @param {Object} calculationData
 * @param {string} calculationData.serviceType
 * @param {number} calculationData.area
 * @param {string} calculationData.frequency
 * @param {string} calculationData.package
 * @param {string} calculationData.scope
 * @param {string} calculationData.roomType
 * @param {Object} calculationData.additionalServices
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export async function calculatePrice(calculationData) {
	try {
		const response = await fetch(`${API_BASE_URL}/calculate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(calculationData),
		});

		if (!response.ok) {
			const errorText = await response.text();

			let errorData;
			try {
				errorData = JSON.parse(errorText);
			} catch {
				errorData = { error: errorText };
			}

			const errorMessage = errorData.detail || errorData.error || errorData.title || `HTTP error! status: ${response.status}`;
			throw new Error(errorMessage);
		}

		const result = await response.json();
		return result;
	} catch (error) {
		throw error;
	}
}

/**
 * @param {string} serviceType
 * @param {Object} formData
 * @returns {Object}
 */
export function formatCalculationRequest(serviceType, formData) {
	const area = parseFloat(formData.area);

	const request = {
		serviceType: serviceType || "cleaning",
		area: isNaN(area) ? 100 : area,
		package: formData.package || "deep",
	};

	if (formData.scope) {
		request.scope = formData.scope;
	}
	if (formData.roomType) {
		request.roomType = formData.roomType;
	}

	let basePrice = 0;

	if (window.getPackageBasePrice && formData.package) {
		const packagePrice = window.getPackageBasePrice(formData.package);
		if (packagePrice != null && packagePrice > 0) {
			basePrice = packagePrice;
		}
	}

	if (basePrice === 0 && window.getGlobalBasePrice) {
		const globalPrice = window.getGlobalBasePrice();
		if (globalPrice != null && globalPrice > 0) {
			basePrice = globalPrice;
		}
	}

	if (basePrice > 0) {
		request.basePrice = basePrice;
	}

	if (window.getAreaPricingTiers) {
		const tiers = window.getAreaPricingTiers(formData.package);
		request.areaPricingTiers = tiers && tiers.length > 0 ? tiers : [];
	} else {
		request.areaPricingTiers = [];
	}

	return request;
}
