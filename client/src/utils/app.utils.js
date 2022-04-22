export function isAuthenticated() {
  return localStorage.getItem("user") ? true : false;
}

export function getAuthTokem() {
  return localStorage.getItem("user");
}

export function getUserDetails() {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
}

export function percentage(amount, total) {
  return Math.round((amount / total) * 100);
}

export function severityColor(severityValue) {
  if (severityValue < 50) return "green";
  else if (severityValue >= 50 && severityValue < 75) return "yellow";
  else if (severityValue >= 75 && severityValue < 90) return "orange";
  else return "red";
}
