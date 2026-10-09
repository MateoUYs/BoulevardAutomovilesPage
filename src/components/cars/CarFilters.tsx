import Link from "next/link";
import type { CatalogResult, CatalogFilters } from "@/lib/car-types";
import { getFuelLabel } from "@/lib/cars";

export function CarFilters({ catalog, filters }: { catalog: CatalogResult; filters: CatalogFilters }) {
  return (
    <form className="rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <label className="grid gap-2 text-base font-black text-zinc-950 lg:col-span-2">
          Buscar
          <input name="q" defaultValue={filters.q} placeholder="Marca, modelo o versión" className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100" />
        </label>
        <label className="grid gap-2 text-base font-black text-zinc-950">
          Marca
          <select name="brand" defaultValue={filters.brand ?? ""} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100">
            <option value="">Todas</option>
            {catalog.brands.map((brand) => <option key={brand}>{brand}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-base font-black text-zinc-950">
          Año
          <select name="year" defaultValue={filters.year ?? ""} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100">
            <option value="">Todos</option>
            {catalog.years.map((year) => <option key={year}>{year}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-base font-black text-zinc-950">
          Combustible
          <select name="fuel" defaultValue={filters.fuel ?? ""} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100">
            <option value="">Todos</option>
            {catalog.fuels.map((fuel) => <option key={fuel} value={fuel}>{getFuelLabel(fuel)}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-base font-black text-zinc-950">
          Orden
          <select name="sort" defaultValue={filters.sort ?? "recent"} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100">
            <option value="recent">Más recientes</option>
            <option value="price-asc">Precio menor</option>
            <option value="price-desc">Precio mayor</option>
          </select>
        </label>
        <label className="grid gap-2 text-base font-black text-zinc-950">
          Precio min.
          <input name="minPrice" inputMode="numeric" defaultValue={filters.minPrice} placeholder="USD" className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100" />
        </label>
        <label className="grid gap-2 text-base font-black text-zinc-950">
          Precio max.
          <input name="maxPrice" inputMode="numeric" defaultValue={filters.maxPrice} placeholder="USD" className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100" />
        </label>
        <div className="grid gap-3 md:grid-cols-2 lg:col-span-2 lg:flex lg:items-end">
          <button type="submit" className="min-h-12 rounded-full bg-[#D32F2F] px-6 text-lg font-black text-white hover:bg-[#b92727] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#D32F2F]">
            Aplicar filtros
          </button>
          <Link href="/autos" className="inline-flex min-h-12 items-center justify-center rounded-full bg-zinc-100 px-6 text-lg font-black text-zinc-950 hover:bg-zinc-200">
            Limpiar
          </Link>
        </div>
      </div>
    </form>
  );
}
