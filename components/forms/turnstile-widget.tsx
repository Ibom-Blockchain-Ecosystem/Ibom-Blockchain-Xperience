"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenge.cloudflare.com/turnstile/v0/api.js";
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window !== "undefined" && window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Turnstile script"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

// Cloudflare Turnstile's bot check. Renders nothing if the site key
// isn't configured — the form still works either way, since the server
// side check (lib/forms/verify-turnstile.ts) also skips itself when
// unconfigured rather than blocking submissions.
export function TurnstileWidget({ onToken }: { onToken: (token: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "auto",
          size: "flexible",
          callback: (token: string) => onToken(token),
          "expired-callback": () => onToken(null),
          "error-callback": () => onToken(null),
        });
      })
      .catch(() => onToken(null));

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }
    };
    // Deliberately mount-once: Turnstile owns the widget's lifecycle
    // after render(), and onToken is only ever a stable state setter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!siteKey) return null;

  return <div ref={containerRef} className="turnstile-widget" />;
}
