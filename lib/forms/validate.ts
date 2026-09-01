// Shared client-side field validators — kept deliberately simple. The
// server (Zod, in each API route) is still the real authority; this is
// just what lets the UI show "this field is empty" the instant someone
// tabs away from it, instead of only after a round trip to the server.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmpty(value: string): boolean {
  return value.trim().length === 0;
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}
