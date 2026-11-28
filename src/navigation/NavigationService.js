export function resetToLogin() {
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}
