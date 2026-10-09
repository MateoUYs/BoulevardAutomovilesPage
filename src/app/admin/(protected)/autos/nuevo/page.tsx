import { CarForm } from "@/components/admin/CarForm";

export default function NewCarPage() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Nuevo auto</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">Carga de vehículo</h1>
        <p className="mt-3 text-lg leading-8 text-zinc-700">Carga de 3 a 8 imágenes, portada, estado y ficha técnica revisada antes de publicar.</p>
      </section>
      <CarForm />
    </div>
  );
}
