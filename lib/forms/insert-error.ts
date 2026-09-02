import type { PostgrestError } from "@supabase/supabase-js";

// Schema-mismatch codes: the table doesn't have a column/relation the code
// expects — almost always means a migration in supabase/migrations/ was
// never run against the live database (rather than anything the user did).
// Logging these loudly, with the code, is what actually lets it get
// caught fast next time instead of everyone just staring at a generic
// "something went wrong" with no lead on where to look.
const SCHEMA_MISMATCH_CODES = new Set(["PGRST204", "42703", "42P01"]);

export function describeInsertError(table: string, error: PostgrestError) {
  const isSchemaMismatch = SCHEMA_MISMATCH_CODES.has(error.code);

  console.error(
    `${table} insert failed [${error.code}]${isSchemaMismatch ? " — LIKELY A MISSING MIGRATION" : ""}:`,
    error.message,
  );

  // Never surface the raw Postgres/PostgREST error to the client — it can
  // leak schema details — but a schema mismatch is a "the site is
  // temporarily broken" situation rather than "try again in a second"
  // one, so at least say that much and give people a way around it.
  return isSchemaMismatch
    ? "This form isn't working right now — please email partnerships@ibomblockchain.com directly instead."
    : "Something went wrong on our end — please try again in a moment, or email partnerships@ibomblockchain.com if it keeps happening.";
}
