import Image from "next/image";
import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { DeleteCarButton } from "@/components/admin/DeleteCarButton";
import { getAdminCars } from "@/lib/admin-data";
import { formatMileage, formatUsd } from "@/lib/format";
import { getCarDisplayName, getCarPublicUrl, getCoverImage, getStatusLabel } from "@/lib/cars";

export const dynamic = "force-dynamic";

export default async function AdminCarsPage() {
  const cars = await getAdminCars();

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Autos</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">Publicaciones</h1>
            <p className="mt-2 text-lg leading-8 text-zinc-700">Listado administrativo. En la siguiente etapa se conecta el formulario persistente completo con imágenes y ficha técnica.</p>
          </div>
          <Link href="/admin/autos/nuevo" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#D32F2F] px-6 text-lg font-black text-white hover:bg-[#b92727]">
            <Plus aria-hidden="true" size={22} />
            Nuevo auto
          </Link>
        </div>
      </section>

      <section className="grid gap-4">
        {cars.map((car) => {
          const cover = getCoverImage(car);
          return (
            <article key={car.id} className="grid gap-4 rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-sm lg:grid-cols-[180px_1fr_auto] lg:items-center">
              <div className="relative h-44 overflow-hidden rounded-3xl bg-zinc-100 lg:h-32">
                {cover ? <Image src={cover.url} alt={cover.alt} fill unoptimized className="object-contain p-1" sizes="180px" /> : null}
              </div>
              <div>
                <h2 className="text-2xl font-black text-zinc-950">{getCarDisplayName(car)}</h2>
                <p className="mt-1 text-lg font-bold text-zinc-600">{car.version ?? "Sin versión cargada"}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-base font-black">
                  <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-zinc-700">{getStatusLabel(car.status)}</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-zinc-700">{formatMileage(car.mileageKm)}</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-[#172B67]">{formatUsd(car.priceUsd)}</span>
                </div>
              </div>
              <div className="flex gap-3 lg:flex-col">
                <Link href={getCarPublicUrl(car)} target="_blank" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 text-base font-black text-white hover:bg-zinc-800">
                  <Eye aria-hidden="true" size={18} />
                  Ver
                </Link>
                <Link href={`/admin/autos/${car.id}/editar`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-zinc-100 px-5 text-base font-black text-zinc-950 hover:bg-zinc-200">
                  Editar
                </Link>
                <DeleteCarButton id={car.id} name={getCarDisplayName(car)} />
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
