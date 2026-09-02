// Server-side verification for Cloudflare Turnstile — the actual bot
// check. The client-side widget only produces a token; this is what
// confirms that token is real by asking Cloudflare directly.
export async function verifyTurnstileToken(token: string | null | undefined, ip: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // Not configured — skip the check rather than block every submission.
  // An unset env var has already taken this site's forms down twice;
  // this one must never be a third.
  if (!secretKey) {
    console.warn("TURNSTILE_SECRET_KEY not set — skipping bot check.");
    return true;
  }

  // Configured, but the client never produced a token — that's the one
  // case genuinely worth rejecting (a real widget always sends one).
  if (!token) return false;

  try {
    const response = await fetch("https://challenge.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token, remoteip: ip }),
    });
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    // Cloudflare being briefly unreachable is an infrastructure hiccup,
    // not evidence of a bot — don't let it block a real visitor.
    console.error("Turnstile verification request failed:", error);
    return true;
  }
}
