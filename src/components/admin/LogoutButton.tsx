"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="min-h-11 rounded-full bg-zinc-100 px-5 text-base font-black text-zinc-950 hover:bg-zinc-200"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
    >
      Salir
    </button>
  );
}
