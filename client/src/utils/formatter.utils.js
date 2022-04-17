export const dateFormat = Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
});

export const datOfMonth = Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "2-digit",
});

export const monthFormat = Intl.DateTimeFormat("en-IN", {
  month: "short",
  year: "numeric",
});

export const currencyFormat = Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});
