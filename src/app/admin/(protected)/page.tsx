import Link from "next/link";
import { CarFront, Clock, FilePenLine, Handshake, Plus } from "lucide-react";
import { getAdminDashboard } from "@/lib/admin-data";
import { formatMileage, formatUsd } from "@/lib/format";
import { getCarDisplayName, getStatusLabel } from "@/lib/cars";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const dashboard = await getAdminDashboard();
  const recentCars = dashboard.cars.slice(0, 5);
  const cards = [
    { label: "Total autos", value: dashboard.total, icon: CarFront },
    { label: "Publicados", value: dashboard.published, icon: FilePenLine },
    { label: "Reservados", value: dashboard.reserved, icon: Handshake },
    { label: "Borradores", value: dashboard.drafts, icon: Clock },
  ];

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] bg-zinc-950 p-6 text-white shadow-xl shadow-zinc-950/10">
        <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Panel admin</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Resumen de Boulevard</h1>
            <p className="mt-3 text-xl leading-8 text-zinc-300">Gestioná publicaciones, estados, precios y datos del sitio.</p>
          </div>
          <Link href="/admin/autos/nuevo" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#D32F2F] px-6 text-lg font-black text-white hover:bg-[#b92727]">
            <Plus aria-hidden="true" size={22} />
            Nuevo auto
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm">
              <Icon aria-hidden="true" className="text-[#D32F2F]" size={30} />
              <p className="mt-4 text-base font-black text-zinc-500">{card.label}</p>
              <p className="mt-1 text-4xl font-black text-zinc-950">{card.value}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-black text-zinc-950">Últimos autos</h2>
          <Link href="/admin/autos" className="rounded-full bg-zinc-100 px-4 py-2 text-base font-black text-zinc-950 hover:bg-zinc-200">Ver todos</Link>
        </div>
        <div className="grid gap-3">
          {recentCars.map((car) => (
            <div key={car.id} className="grid gap-2 rounded-2xl bg-zinc-50 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <div>
                <p className="text-xl font-black text-zinc-950">{getCarDisplayName(car)}</p>
                <p className="text-base font-bold text-zinc-600">{formatMileage(car.mileageKm)}</p>
              </div>
              <p className="text-lg font-black text-[#172B67]">{formatUsd(car.priceUsd)}</p>
              <p className="rounded-full bg-white px-3 py-2 text-sm font-black text-zinc-700 ring-1 ring-zinc-200">{getStatusLabel(car.status)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
