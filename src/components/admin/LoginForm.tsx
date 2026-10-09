"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="grid gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);
        const form = new FormData(event.currentTarget);
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 10000);

        let response: Response;
        try {
          response = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
            signal: controller.signal,
          });
        } catch {
          setError("El ingreso tardó demasiado. Probá de nuevo en unos segundos.");
          setLoading(false);
          return;
        } finally {
          window.clearTimeout(timeout);
        }

        setLoading(false);

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          setError(data?.error ?? "No se pudo iniciar sesión.");
          return;
        }

        router.push(searchParams.get("next") ?? "/admin");
        router.refresh();
      }}
    >
      <label className="grid gap-2 text-base font-black text-zinc-950">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100"
        />
      </label>
      <label className="grid gap-2 text-base font-black text-zinc-950">
        Contraseña
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100"
        />
      </label>
      {error ? <p className="rounded-2xl bg-red-50 p-4 text-base font-bold text-red-800">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="min-h-13 rounded-full bg-[#D32F2F] px-6 py-3 text-lg font-black text-white hover:bg-[#b92727] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Ingresando..." : "Ingresar al panel"}
      </button>
    </form>
  );
}
