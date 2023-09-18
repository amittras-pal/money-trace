export function getBaseURL() {
  return process.env.NODE_ENV === "production"
    ? "https://money-trace.onrender.com"
    : process.env.REACT_APP_API.toString();
}
