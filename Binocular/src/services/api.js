const API_BASE_URL = "http://127.0.0.1:5000";

const API = {
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.response = response;
      throw error;
    }

    return response.json();
  },

  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.response = response;
      throw error;
    }

    return response.json();
  }
};

export default API;

export const predictTest = async (testType, data) => {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      test_type: testType,
      data: data
    })
  });

  return response.json();
};