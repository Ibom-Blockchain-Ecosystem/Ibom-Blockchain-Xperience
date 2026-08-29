// Basic CSRF mitigation: reject POSTs whose Origin header doesn't match
// this site. A browser always sends Origin on cross-site POSTs, so a
// request forged from another page can't pass this check — only a
// request actually made from our own pages can.
export function isTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  // Some same-origin requests (older browsers, some tooling) omit Origin
  // entirely — we don't fail those closed, since Origin's absence isn't
  // itself evidence of a forged request.
  if (!origin) return true;

  const allowed = new Set(
    [process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"].filter(Boolean),
  );

  return allowed.has(origin);
}
