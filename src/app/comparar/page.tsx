import type { Metadata } from "next";
import { ComparisonCharts } from "@/components/cars/ComparisonCharts";
import { ComparisonTable } from "@/components/cars/ComparisonTable";
import { CompareSelectionGrid } from "@/components/cars/CompareSelectionGrid";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getCarsBySlugs, getCatalogCars, getFuelPriceConfig } from "@/lib/cars";

export const dynamic = "force-dynamic";

type CompararPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: CompararPageProps): Promise<Metadata> {
  const params = await searchParams;
  const hasAutos = Boolean(params.autos);
  return {
    title: "Comparador de vehículos",
    description: "Compará autos lado a lado en Boulevard Automóviles.",
    alternates: { canonical: "/comparar" },
    robots: hasAutos ? { index: false, follow: true } : { index: true, follow: true },
  };
}

function parseAutos(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.split(",").map((slug) => slug.trim()).filter(Boolean).slice(0, 3) ?? [];
}

export default async function CompararPage({ searchParams }: CompararPageProps) {
  const params = await searchParams;
  const slugs = parseAutos(params.autos);
  const [cars, fuelPrices] = await Promise.all([getCarsBySlugs(slugs), getFuelPriceConfig()]);

  if (cars.length < 2) {
    const catalog = await getCatalogCars({ sort: "recent" });

    return (
      <section className="bg-[#f6f7fb]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Comparador</p>
          <h1 className="mt-4 text-balance text-5xl font-black leading-tight tracking-tight text-zinc-950 sm:text-6xl">Elegí autos para comparar.</h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-zinc-700">
            No hace falta entrar auto por auto. Seleccioná dos o tres vehículos desde acá y abajo va a aparecer la barra para abrir la comparación.
          </p>
          <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-3xl font-black text-zinc-950">Autos disponibles</h2>
            <p className="mt-2 text-lg leading-8 text-zinc-700">Máximo 2 en móvil y hasta 3 en desktop. Podés quitar la selección desde la barra inferior.</p>
          </div>
          <div className="mt-8">
            <CompareSelectionGrid cars={catalog.cars} />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/autos" tone="secondary">Ver catálogo completo</ButtonLink>
            <ButtonLink href="/contacto" tone="ghost">Consultar ayuda</ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f6f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 max-w-4xl">
          <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Comparador</p>
          <h1 className="mt-3 text-balance text-5xl font-black leading-tight tracking-tight text-zinc-950 sm:text-6xl">
            Comparación lado a lado.
          </h1>
          <p className="mt-5 text-xl leading-9 text-zinc-700">
            Hasta 2 autos en móvil y hasta 3 en desktop. Podés copiar esta URL y enviarla por WhatsApp.
          </p>
        </div>
        <ComparisonCharts cars={cars} fuelPrices={fuelPrices} />
        <div className="mt-8" />
        <ComparisonTable cars={cars} fuelPrices={fuelPrices} />
      </div>
    </section>
  );
}
