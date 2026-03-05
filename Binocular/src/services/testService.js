import API from "./api";

export const startTest = (data) =>
  API.post("/start_test", data);

export const uploadEyeData = (data) =>
  API.post("/upload_eye_data", data);

export const runAI = (data) =>
  API.post("/run_ai", data);

export const getResult = (test_id) =>
  API.get(`/get_result?test_id=${test_id}`);