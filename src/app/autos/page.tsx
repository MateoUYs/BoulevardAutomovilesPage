import type { Metadata } from "next";
import Link from "next/link";
import { CarCard } from "@/components/cars/CarCard";
import { CarFilters } from "@/components/cars/CarFilters";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getCatalogCars } from "@/lib/cars";
import { buildGeneralWhatsAppUrl } from "@/lib/site";
import type { CatalogFilters } from "@/lib/car-types";

export const metadata: Metadata = {
  title: "Autos en venta en Uruguay",
  description: "Catálogo de autos de Boulevard Automóviles en Uruguay. Consultá vehículos disponibles, permutas y financiación bancaria desde Rosario.",
  alternates: { canonical: "/autos" },
};

export const dynamic = "force-dynamic";

type AutosPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function normalizeSearchParams(params: Record<string, string | string[] | undefined>): CatalogFilters {
  const getValue = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    q: getValue("q"),
    brand: getValue("brand"),
    year: getValue("year"),
    fuel: getValue("fuel"),
    minPrice: getValue("minPrice"),
    maxPrice: getValue("maxPrice"),
    sort: getValue("sort"),
    page: getValue("page"),
  };
}

function buildPageHref(filters: CatalogFilters, page: number) {
  const params = new URLSearchParams();
  Object.entries({ ...filters, page: String(page) }).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return `/autos?${params.toString()}`;
}

export default async function AutosPage({ searchParams }: AutosPageProps) {
  const filters = normalizeSearchParams(await searchParams);
  const catalog = await getCatalogCars(filters);

  return (
    <section className="bg-[#f6f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 max-w-4xl">
          <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Catálogo</p>
          <h1 className="mt-3 text-balance text-5xl font-black leading-tight tracking-tight text-zinc-950 sm:text-6xl">
            Autos disponibles en Boulevard Automóviles.
          </h1>
          <p className="mt-5 text-xl leading-9 text-zinc-700">
            Filtrá, compará y consultá directo por WhatsApp. Los precios están expresados en dólares estadounidenses.
          </p>
        </div>

        <CarFilters catalog={catalog} filters={filters} />

        <div className="mt-6 flex flex-col gap-3 text-lg font-bold text-zinc-700 sm:flex-row sm:items-center sm:justify-between">
          <p>{catalog.total} vehículo{catalog.total === 1 ? "" : "s"} encontrado{catalog.total === 1 ? "" : "s"}</p>
          <p>Página {catalog.page} de {catalog.totalPages}</p>
        </div>

        {catalog.cars.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {catalog.cars.map((car) => <CarCard car={car} key={car.id} />)}
          </div>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-3xl font-black text-zinc-950">No encontramos vehículos con esos filtros.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl leading-9 text-zinc-700">
              Podés limpiar los filtros o consultar por WhatsApp para que te avisemos cuando ingrese algo similar.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/autos">Limpiar filtros</ButtonLink>
              <ButtonLink href={buildGeneralWhatsAppUrl()} tone="secondary" target="_blank" rel="noreferrer">
                Consultar por WhatsApp
              </ButtonLink>
            </div>
          </div>
        )}

        {catalog.totalPages > 1 ? (
          <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Paginación de catálogo">
            <Link
              href={buildPageHref(filters, Math.max(1, catalog.page - 1))}
              className="inline-flex min-h-12 items-center rounded-full bg-white px-5 text-lg font-black text-zinc-950 ring-1 ring-zinc-300 aria-disabled:pointer-events-none aria-disabled:opacity-50"
              aria-disabled={catalog.page <= 1}
            >
              Anterior
            </Link>
            <Link
              href={buildPageHref(filters, Math.min(catalog.totalPages, catalog.page + 1))}
              className="inline-flex min-h-12 items-center rounded-full bg-white px-5 text-lg font-black text-zinc-950 ring-1 ring-zinc-300 aria-disabled:pointer-events-none aria-disabled:opacity-50"
              aria-disabled={catalog.page >= catalog.totalPages}
            >
              Siguiente
            </Link>
          </nav>
        ) : null}
      </div>
    </section>
  );
}
