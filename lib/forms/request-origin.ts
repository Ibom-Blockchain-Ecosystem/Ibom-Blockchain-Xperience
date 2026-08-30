// Basic CSRF mitigation: reject POSTs whose Origin header doesn't match
// the host the request actually arrived at. A browser always sends
// Origin on cross-site POSTs, so a request forged from another page
// can't pass this check — only a request actually made from our own
// pages can.
//
// This used to compare against NEXT_PUBLIC_SITE_URL, which only exists
// in .env.local (never deployed) — every real visitor in production
// failed the check because that env var was unset there. Comparing
// against the request's own Host/X-Forwarded-Host instead means this
// works correctly on any domain (production, a Vercel preview URL,
// localhost) with nothing to configure per-environment.
export function isTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  // Some same-origin requests (older browsers, some tooling) omit Origin
  // entirely — we don't fail those closed, since Origin's absence isn't
  // itself evidence of a forged request.
  if (!origin) return true;

  const requestUrl = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? requestUrl.host;
  const protocol = request.headers.get("x-forwarded-proto") ?? requestUrl.protocol.replace(":", "");
  const expectedOrigin = `${protocol}://${host}`;

  if (origin !== expectedOrigin) return false;

  // Defense in depth: X-Forwarded-Host is only trustworthy because the
  // proxy in front of this app (Vercel) is trusted to set it from the
  // real request rather than pass through a client-supplied value. If
  // that assumption were ever wrong, an attacker who controls
  // X-Forwarded-Host could make it equal their own forged Origin and
  // sail through the check above. This second check means that even
  // then, they can only pick a host that's already on an explicit
  // allowlist — not an arbitrary one.
  //
  // Deliberately opt-in: an unset env var took every form on this site
  // down once already (that's the exact bug this whole file exists to
  // fix). If ALLOWED_ORIGIN_HOSTS isn't configured, this extra layer
  // is skipped rather than failing closed — it must never repeat that.
  const allowedHosts = (process.env.ALLOWED_ORIGIN_HOSTS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (allowedHosts.length === 0) return true;

  return allowedHosts.includes(host);
}
