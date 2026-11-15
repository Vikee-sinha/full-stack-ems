const AUTH_STORAGE_KEY = "ems-user";

export function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    if (user?.role === "ADMIN" || user?.role === "EMPLOYEE") return user;
  } catch {
    // Ignore invalid data and treat the session as signed out.
  }
  return null;
}

export function saveCurrentUser(user) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
