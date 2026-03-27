import { API_CONFIG } from '../../../../config.js';

export async function fetchCleaningServiceData(locale = "en") {
  const url = `${API_CONFIG.getApiUrl('/api/cleaning-service')}?locale=${locale}&populate=deep`;

  const res = await fetch(url);

  if (!res.ok) throw new Error(`${res.status}`);

  return await res.json();
}
