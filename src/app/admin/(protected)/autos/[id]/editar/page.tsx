import { notFound } from "next/navigation";
import { CarForm } from "@/components/admin/CarForm";
import { getAdminCarById } from "@/lib/admin-data";
import { getCarDisplayName } from "@/lib/cars";

export const dynamic = "force-dynamic";

export default async function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await getAdminCarById(id);
  if (!car) notFound();

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Editar auto</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">{getCarDisplayName(car)}</h1>
        <p className="mt-3 text-lg leading-8 text-zinc-700">Modificá datos, estado, ficha técnica, imágenes, orden y portada.</p>
      </section>
      <CarForm car={car} />
    </div>
  );
}
