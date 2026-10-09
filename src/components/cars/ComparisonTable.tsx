import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CarImage } from "@/components/cars/CarImage";
import { StatusBadge, TagBadge } from "@/components/cars/CarBadges";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { calculateCostPer100KmUyu, getBestNumericSlugs } from "@/lib/comparison";
import { formatKmPerLiter, formatMileage, formatUsd, formatUyu } from "@/lib/format";
import {
  getAbsoluteCarUrl,
  getCarDisplayName,
  getCarPublicUrl,
  getCategoryLabel,
  getCoverImage,
  getFuelLabel,
  getTransmissionLabel,
} from "@/lib/cars";
import { buildVehicleWhatsAppUrl, siteConfig } from "@/lib/site";
import type { FuelPriceConfig, PublicCar } from "@/lib/car-types";

type Row = {
  label: string;
  values: (car: PublicCar) => string;
  best?: Set<string>;
};

function BestMarker({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-900">
      <CheckCircle2 aria-hidden="true" size={16} />
      Mejor
    </span>
  );
}

export function ComparisonTable({ cars, fuelPrices }: { cars: PublicCar[]; fuelPrices: FuelPriceConfig }) {
  const costBySlug = new Map(cars.map((car) => [car.slug, calculateCostPer100KmUyu(car, fuelPrices)]));
  const categorySet = new Set(cars.map((car) => car.category).filter(Boolean));

  const rows: Row[] = [
    { label: "Precio en USD", values: (car) => formatUsd(car.priceUsd), best: getBestNumericSlugs(cars, (car) => car.priceUsd, "min") },
    { label: "Año", values: (car) => String(car.year), best: getBestNumericSlugs(cars, (car) => car.year, "max") },
    { label: "Kilometraje", values: (car) => formatMileage(car.mileageKm), best: getBestNumericSlugs(cars, (car) => car.mileageKm, "min") },
    { label: "Consumo ciudad", values: (car) => formatKmPerLiter(car.cityKmPerLiter), best: getBestNumericSlugs(cars, (car) => car.cityKmPerLiter, "max") },
    { label: "Consumo ruta", values: (car) => formatKmPerLiter(car.roadKmPerLiter), best: getBestNumericSlugs(cars, (car) => car.roadKmPerLiter, "max") },
    {
      label: "Costo estimado cada 100 km",
      values: (car) => {
        const cost = costBySlug.get(car.slug);
        return typeof cost === "number" ? `${formatUyu(cost)} aprox.` : "No disponible";
      },
      best: getBestNumericSlugs(cars, (car) => costBySlug.get(car.slug), "min"),
    },
    { label: "Motor y cilindrada", values: (car) => [car.engine, car.engineCapacity].filter(Boolean).join(" - ") || "No disponible" },
    { label: "Potencia", values: (car) => (car.powerHp ? `${car.powerHp} HP` : "No disponible"), best: getBestNumericSlugs(cars, (car) => car.powerHp, "max") },
    { label: "Transmisión", values: (car) => getTransmissionLabel(car.transmission) },
    { label: "Combustible", values: (car) => getFuelLabel(car.fuelType) },
    { label: "Puertas y plazas", values: (car) => car.doors && car.seats ? `${car.doors} puertas - ${car.seats} plazas` : "No disponible" },
    { label: "Categoría", values: (car) => getCategoryLabel(car.category) },
  ];

  return (
    <div className="space-y-5">
      {categorySet.size > 1 ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-lg font-bold leading-8 text-amber-950">
          Estás comparando vehículos de categorías distintas. Algunos valores pueden no ser directamente equivalentes.
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">Tabla comparativa de vehículos</caption>
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-52 bg-white p-4 text-lg font-black text-zinc-950">Dato</th>
              {cars.map((car) => {
                const cover = getCoverImage(car);
                const name = getCarDisplayName(car);
                return (
                  <th className="min-w-64 border-l border-zinc-200 p-4 align-top" key={car.slug}>
                    <Link href={getCarPublicUrl(car)} className="block focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#D32F2F]">
                      <div className="relative mb-4 h-40 overflow-hidden rounded-3xl bg-zinc-100">
                        {cover ? <CarImage src={cover.url} alt={cover.alt} className="object-contain p-1" sizes="260px" /> : null}
                      </div>
                      <h2 className="text-2xl font-black text-zinc-950">{name}</h2>
                      <p className="mt-2 text-2xl font-black text-[#172B67]">{formatUsd(car.priceUsd)}</p>
                    </Link>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <StatusBadge status={car.status} />
                      <TagBadge tag={car.tag} />
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-t border-zinc-200" key={row.label}>
                <th className="sticky left-0 z-10 bg-white p-4 text-base font-black text-zinc-950 sm:text-lg">{row.label}</th>
                {cars.map((car) => (
                  <td className="border-l border-zinc-200 p-4 align-top text-lg font-bold leading-7 text-zinc-800" key={`${row.label}-${car.slug}`}>
                    {row.values(car)}
                    <BestMarker show={Boolean(row.best?.has(car.slug) && row.best.size < cars.length)} />
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-zinc-200">
              <th className="sticky left-0 z-10 bg-white p-4 text-base font-black text-zinc-950 sm:text-lg">Acción</th>
              {cars.map((car) => {
                const name = getCarDisplayName(car);
                const absoluteUrl = getAbsoluteCarUrl(car, siteConfig.siteUrl);
                return (
                  <td className="border-l border-zinc-200 p-4" key={`action-${car.slug}`}>
                    <div className="grid gap-3">
                      <ButtonLink href={buildVehicleWhatsAppUrl(name, absoluteUrl)} target="_blank" rel="noreferrer" className="w-full">
                        Consultar por este
                      </ButtonLink>
                      <ButtonLink href={getCarPublicUrl(car)} tone="secondary" className="w-full">
                        Ver ficha
                      </ButtonLink>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="rounded-3xl bg-zinc-100 p-5 text-lg leading-8 text-zinc-700">
        El costo estimado cada 100 km se calcula con el consumo cargado y el precio de combustible configurado. Puede variar según manejo, estado del vehículo y condiciones de uso.
      </p>
    </div>
  );
}
