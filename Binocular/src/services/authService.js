import API from "./api";

// ─── helper: throw with backend message if status is false ───────────────────
const checkStatus = (response, fallback) => {
  if (response.status === false) {
    const err = new Error(response.message || fallback);
    err.backendMessage = response.message;
    throw err;
  }
  return response;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser = async (data) => {
  const res = await API.post("/register", data);
  return checkStatus(res, "Registration failed");
};

export const loginUser = async (data) => {
  const res = await API.post("/login", data);
  return checkStatus(res, "Login failed");
};

export const forgotPassword = async (email) => {
  const res = await API.post("/forgot-password", { email });
  return checkStatus(res, "Failed to send reset link");
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const getProfile = async (user_id) => {
  const res = await API.get(`/profile?user_id=${encodeURIComponent(user_id)}`);
  return checkStatus(res, "Failed to load profile");
};

export const updateProfile = async (data) => {
  const response = await fetch("http://127.0.0.1:5000/update_profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  return checkStatus(res, "Failed to update profile");
};

