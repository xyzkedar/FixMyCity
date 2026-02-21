const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
}

// Reports API
export async function getReports(filters = {}) {
  const params = new URLSearchParams(filters);
  return fetchAPI(`/api/reports?${params}`);
}

export async function getReport(id) {
  return fetchAPI(`/api/reports/${id}`);
}

export async function submitReport(reportData) {
  const formData = new FormData();
  
  if (reportData.image) {
    formData.append('image', reportData.image);
  }
  formData.append('title', reportData.title);
  formData.append('description', reportData.description);
  formData.append('category', reportData.category);
  formData.append('latitude', reportData.latitude.toString());
  formData.append('longitude', reportData.longitude.toString());
  
  if (reportData.userId) {
    formData.append('userId', reportData.userId);
  }

  const response = await fetch(`${API_URL}/api/reports/submit`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit report');
  }
  
  return data;
}

export async function updateReportStatus(id, status, notes) {
  return fetchAPI(`/api/reports/${id}/status`, {
    method: 'PATCH',
    body: { status, notes },
  });
}

export async function getStats() {
  return fetchAPI('/api/reports/stats/summary');
}

// Auth API
export async function signup(email, password, userType = 'citizen') {
  return fetchAPI('/api/auth/signup', {
    method: 'POST',
    body: { email, password, userType },
  });
}

export async function login(email, password) {
  return fetchAPI('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function logout() {
  return fetchAPI('/api/auth/logout', {
    method: 'POST',
  });
}

export async function getCurrentUser() {
  return fetchAPI('/api/auth/me');
}
