
import { resetToLogin } from "../navigation/NavigationService";

const API_URL = import.meta.env.VITE_API_URL;
const APP_TOKEN = import.meta.env.VITE_API_APP_TOKEN;

export async function apiRequest(endpoint, options = {}) {
  if (!API_URL) {
    throw new Error("No se ha configurado VITE_API_URL.");
  }

  if (!APP_TOKEN) {
    throw new Error("No se ha configurado VITE_API_APP_TOKEN.");
  }

  const {
    method = "GET",
    body,
    headers = {},
    ...rest
  } = options;

  const userToken = localStorage.getItem("accessToken");
  const isFormData = body instanceof FormData;

  const requestHeaders = new Headers(headers);

  requestHeaders.set("x-api-token", APP_TOKEN);

  if (userToken) {
    requestHeaders.set("Authorization", `Bearer ${userToken}`);
  }

  if (body !== undefined && !isFormData) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    method,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
  });

  const responseText = await response.text();

  let data = null;

  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    data = responseText;
  }

  if (response.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    resetToLogin();

    throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  }

  if (response.status === 403) {
    throw new Error(
      data?.message || "No tienes permisos para realizar esta acción."
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `Error HTTP: ${response.status}`
    );
  }

  return data;
}
