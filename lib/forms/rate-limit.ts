// A simple in-memory, per-IP rate limiter. Good enough at this site's
// traffic scale — no Redis or external service needed. On serverless,
// this resets per cold start rather than being shared across every
// instance; that's an acceptable trade-off here, since the goal is
// stopping rapid-fire spam-clicking, not perfect global enforcement.
const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, { windowMs, max }: { windowMs: number; max: number }): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= max) {
    hits.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return true;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
