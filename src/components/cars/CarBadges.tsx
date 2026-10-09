import { clsx } from "clsx";
import type { CarTag, PublishStatus } from "@/lib/car-types";

const statusLabels: Record<PublishStatus, string> = {
  BORRADOR: "Borrador",
  PUBLICADO: "Disponible",
  RESERVADO: "Reservado",
  VENDIDO: "Vendido",
};

const tagLabels: Record<CarTag, string> = {
  CERO_KM: "0 KM",
  RECIEN_INGRESADO: "Recién ingresado",
  OPORTUNIDAD: "Oportunidad",
  FINANCIABLE: "Financiable",
};

export function StatusBadge({ status }: { status: PublishStatus }) {
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1.5 text-sm font-black uppercase tracking-wide",
        status === "PUBLICADO" && "bg-emerald-100 text-emerald-900",
        status === "RESERVADO" && "bg-amber-100 text-amber-900",
        status === "VENDIDO" && "bg-zinc-900 text-white",
        status === "BORRADOR" && "bg-zinc-200 text-zinc-800",
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

export function TagBadge({ tag }: { tag: CarTag | null }) {
  if (!tag) return null;

  return <span className="rounded-full bg-[#D32F2F] px-3 py-1.5 text-sm font-black uppercase tracking-wide text-white">{tagLabels[tag]}</span>;
}
