const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('pastpaper_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Subjects
  getSubjects: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/subjects${query ? `?${query}` : ''}`);
    return res.json();
  },

  getSubjectById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/subjects/${id}`);
    return res.json();
  },

  createSubject: async (data) => {
    const res = await fetch(`${API_BASE_URL}/subjects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateSubject: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteSubject: async (id) => {
    const res = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // PDFs (Past Papers & Marking Schemes)
  getPDFs: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/pdfs${query ? `?${query}` : ''}`);
    return res.json();
  },

  getPDFById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/pdfs/${id}`);
    return res.json();
  },

  createPDF: async (data) => {
    const res = await fetch(`${API_BASE_URL}/pdfs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updatePDF: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/pdfs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deletePDF: async (id) => {
    const res = await fetch(`${API_BASE_URL}/pdfs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },


  // Metadata: Levels, Streams, Types
  getLevels: async () => {
    const res = await fetch(`${API_BASE_URL}/levels`);
    return res.json();
  },

  createLevel: async (data) => {
    const res = await fetch(`${API_BASE_URL}/levels`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateLevel: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/levels/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteLevel: async (id) => {
    const res = await fetch(`${API_BASE_URL}/levels/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getStreams: async () => {
    const res = await fetch(`${API_BASE_URL}/streams`);
    return res.json();
  },

  createStream: async (data) => {
    const res = await fetch(`${API_BASE_URL}/streams`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateStream: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/streams/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteStream: async (id) => {
    const res = await fetch(`${API_BASE_URL}/streams/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getTypes: async () => {
    const res = await fetch(`${API_BASE_URL}/types`);
    return res.json();
  },

  createType: async (data) => {
    const res = await fetch(`${API_BASE_URL}/types`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateType: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/types/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteType: async (id) => {
    const res = await fetch(`${API_BASE_URL}/types/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Mediums / Languages
  getMediums: async () => {
    const res = await fetch(`${API_BASE_URL}/languages`);
    return res.json();
  },

  createMedium: async (data) => {
    const res = await fetch(`${API_BASE_URL}/languages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateMedium: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/languages/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteMedium: async (id) => {
    const res = await fetch(`${API_BASE_URL}/languages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // User Management (Admin Only)
  getUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  updateUserRole: async (id, role) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role })
    });
    return res.json();
  },

  deleteUser: async (id) => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Admin Stats
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return res.json();
  }
};

