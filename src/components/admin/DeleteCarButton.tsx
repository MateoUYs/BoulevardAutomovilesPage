"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteCarButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-red-50 px-5 text-base font-black text-red-800 hover:bg-red-100 disabled:opacity-60"
      onClick={async () => {
        const confirmed = window.confirm(`¿Eliminar ${name}? Esta acción no se puede deshacer.`);
        if (!confirmed) return;
        setLoading(true);
        const response = await fetch(`/api/admin/cars/${id}`, { method: "DELETE" });
        setLoading(false);
        if (!response.ok) {
          window.alert("No se pudo eliminar. Verificá la conexión a la base de datos.");
          return;
        }
        router.refresh();
      }}
    >
      <Trash2 aria-hidden="true" size={18} />
      {loading ? "Eliminando" : "Eliminar"}
    </button>
  );
}
