import "server-only";

import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl() {
  const value = process.env.SUPABASE_URL?.trim();
  if (!value) return null;

  if (/^https?:\/\//.test(value)) return value;

  if (/^[a-z0-9]{20,}$/.test(value)) {
    return `https://${value}.supabase.co`;
  }

  return null;
}

export function getSupabaseAdmin() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase Storage no está configurado. Revisá SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el .env de la VPS.");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getStorageBucket() {
  return process.env.SUPABASE_BUCKET ?? "autos";
}
