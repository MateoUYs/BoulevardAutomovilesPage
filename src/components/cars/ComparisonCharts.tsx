import { CheckCircle2 } from "lucide-react";
import { calculateCostPer100KmUyu } from "@/lib/comparison";
import { formatMileage, formatUsd, formatUyu } from "@/lib/format";
import type { FuelPriceConfig, PublicCar } from "@/lib/car-types";

type ChartMetric = {
  label: string;
  helper: string;
  mode: "min" | "max";
  getValue: (car: PublicCar) => number | null;
  format: (value: number) => string;
};

function chartWidth(value: number, values: number[]) {
  const max = Math.max(...values);
  if (!max) return 0;
  return Math.max(8, Math.round((value / max) * 100));
}

export function ComparisonCharts({ cars, fuelPrices }: { cars: PublicCar[]; fuelPrices: FuelPriceConfig }) {
  const metrics: ChartMetric[] = [
    {
      label: "Precio",
      helper: "Menor precio destacado",
      mode: "min",
      getValue: (car) => car.priceUsd,
      format: formatUsd,
    },
    {
      label: "Kilometraje",
      helper: "Menor kilometraje destacado",
      mode: "min",
      getValue: (car) => car.mileageKm,
      format: formatMileage,
    },
    {
      label: "Consumo en ruta",
      helper: "Mayor km/l destacado",
      mode: "max",
      getValue: (car) => car.roadKmPerLiter,
      format: (value) => `${value.toLocaleString("es-UY", { maximumFractionDigits: 1 })} km/l`,
    },
    {
      label: "Costo cada 100 km",
      helper: "Menor costo estimado destacado",
      mode: "min",
      getValue: (car) => calculateCostPer100KmUyu(car, fuelPrices),
      format: (value) => `${formatUyu(value)} aprox.`,
    },
  ];

  return (
    <section className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6">
        <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Grafica rapida</p>
        <h2 className="mt-2 text-3xl font-black text-zinc-950">Diferencias visuales</h2>
        <p className="mt-2 text-lg leading-8 text-zinc-700">Los destacados usan icono y texto, no solo color.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {metrics.map((metric) => {
          const rows = cars.map((car) => ({ car, value: metric.getValue(car) })).filter((row): row is { car: PublicCar; value: number } => typeof row.value === "number");
          if (rows.length !== cars.length) {
            return (
              <div key={metric.label} className="rounded-3xl bg-zinc-50 p-5">
                <h3 className="text-2xl font-black text-zinc-950">{metric.label}</h3>
                <p className="mt-3 text-lg font-bold text-zinc-600">No disponible para todos los autos.</p>
              </div>
            );
          }

          const values = rows.map((row) => row.value);
          const best = metric.mode === "min" ? Math.min(...values) : Math.max(...values);

          return (
            <div key={metric.label} className="rounded-3xl bg-zinc-50 p-5">
              <h3 className="text-2xl font-black text-zinc-950">{metric.label}</h3>
              <p className="mt-1 text-base font-bold text-zinc-600">{metric.helper}</p>
              <div className="mt-5 grid gap-4">
                {rows.map(({ car, value }) => {
                  const isBest = value === best;
                  return (
                    <div key={`${metric.label}-${car.slug}`}>
                      <div className="mb-2 flex items-center justify-between gap-3 text-base font-black text-zinc-950">
                        <span>{car.brand} {car.model}</span>
                        <span>{metric.format(value)}</span>
                      </div>
                      <div className="h-5 overflow-hidden rounded-full bg-white ring-1 ring-zinc-200">
                        <div className="h-full rounded-full bg-[#172B67]" style={{ width: `${chartWidth(value, values)}%` }} />
                      </div>
                      {isBest ? (
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-900">
                          <CheckCircle2 aria-hidden="true" size={16} />
                          Mejor
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
