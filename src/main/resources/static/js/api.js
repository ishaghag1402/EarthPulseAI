// Shared same-origin API helper. Includes Spring Security CSRF token.
window.EarthPulseApi = {
  async post(url, payload) {
    const token = document.querySelector('meta[name="_csrf"]')?.content;
    const header = document.querySelector('meta[name="_csrf_header"]')?.content || 'X-CSRF-TOKEN';
    const headers = {'Content-Type': 'application/json'};
    if (token) headers[header] = token;
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers,
      body: JSON.stringify(payload)
    });
    const type = response.headers.get('content-type') || '';
    const data = type.includes('application/json')
      ? await response.json()
      : {answer: await response.text()};
    if (!response.ok) {
      throw new Error(data.message || data.answer || `Request failed (${response.status})`);
    }
    return data;
  }
};
