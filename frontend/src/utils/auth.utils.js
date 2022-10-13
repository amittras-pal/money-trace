export function isAuthenticated() {
  return localStorage.getItem("token") ? true : false;
}

export function getAuthToken() {
  return localStorage.getItem("token");
}
