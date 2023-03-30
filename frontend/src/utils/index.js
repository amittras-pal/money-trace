export function getAuthToken() {
  return localStorage.getItem("authToken");
}

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export function formatCurrency(amount) {
  return formatter.format(amount);
}

export function getPercentage(amount, total) {
  return ((amount / total) * 100).toFixed(0);
}
