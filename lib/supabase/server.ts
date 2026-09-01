import { createClient } from "@supabase/supabase-js";

// Server-only client — uses the secret key, which has full read/write
// access to every table. Never import this file from a "use client"
// component; it must only ever run inside Route Handlers / server code.
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Missing Supabase env vars: check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local",
    );
  }

  return createClient(url, secretKey, {
    auth: { persistSession: false },
  });
}
