import { CalendarDays, CarFront, CircleGauge, Fuel, Gauge, Settings, ShieldCheck, Zap } from "lucide-react";
import { formatKmPerLiter, formatMileage, formatUsd } from "@/lib/format";
import { getCategoryLabel, getFuelLabel, getStatusLabel, getTransmissionLabel } from "@/lib/cars";
import type { PublicCar } from "@/lib/car-types";

const unavailable = "No disponible";

export function CarSummary({ car }: { car: PublicCar }) {
  const items = [
    { icon: CalendarDays, label: "Año", value: String(car.year) },
    { icon: Gauge, label: "Kilómetros", value: formatMileage(car.mileageKm) },
    { icon: Fuel, label: "Combustible", value: getFuelLabel(car.fuelType) },
    { icon: Settings, label: "Caja", value: getTransmissionLabel(car.transmission) },
    { icon: CircleGauge, label: "Motor", value: car.engine ?? unavailable },
    { icon: CarFront, label: "Estado", value: getStatusLabel(car.status) },
  ];

  return (
    <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Precio</p>
      <p className="mt-2 text-5xl font-black tracking-tight text-[#172B67]">{formatUsd(car.priceUsd)}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl bg-zinc-50 p-4">
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#D32F2F] shadow-sm">
                <Icon aria-hidden="true" size={22} />
              </div>
              <p className="text-sm font-black uppercase tracking-wide text-zinc-500">{item.label}</p>
              <p className="mt-1 text-lg font-black text-zinc-950">{item.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CarSpecsTable({ car }: { car: PublicCar }) {
  const rows = [
    ["Marca", car.brand],
    ["Modelo", car.model],
    ["Versión", car.version ?? unavailable],
    ["Categoría", getCategoryLabel(car.category)],
    ["Año", String(car.year)],
    ["Kilometraje", formatMileage(car.mileageKm)],
    ["Precio", formatUsd(car.priceUsd)],
    ["Motor", car.engine ?? unavailable],
    ["Cilindrada", car.engineCapacity ?? unavailable],
    ["Potencia", car.powerHp ? `${car.powerHp} HP` : unavailable],
    ["Transmisión", getTransmissionLabel(car.transmission)],
    ["Combustible", getFuelLabel(car.fuelType)],
    ["Consumo ciudad", formatKmPerLiter(car.cityKmPerLiter)],
    ["Consumo ruta", formatKmPerLiter(car.roadKmPerLiter)],
    ["Puertas", car.doors ? String(car.doors) : unavailable],
    ["Plazas", car.seats ? String(car.seats) : unavailable],
  ];

  return (
    <section className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <ShieldCheck aria-hidden="true" className="text-[#D32F2F]" size={32} />
        <div>
          <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Ficha técnica</p>
          <h2 className="text-3xl font-black text-zinc-950">Datos del vehículo</h2>
        </div>
      </div>
      <div className="grid overflow-hidden rounded-3xl border border-zinc-200 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[0.85fr_1fr] border-b border-zinc-200 last:border-b-0 md:odd:border-r md:[&:nth-last-child(2)]:border-b-0">
            <dt className="bg-zinc-50 p-4 text-base font-black text-zinc-600">{label}</dt>
            <dd className="p-4 text-base font-bold text-zinc-950 sm:text-lg">{value}</dd>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ConsumptionPanel({ car, reference }: { car: PublicCar; reference?: { cityKmPerLiterAvg: number; roadKmPerLiterAvg: number } | null }) {
  const hasConsumption = typeof car.cityKmPerLiter === "number" || typeof car.roadKmPerLiter === "number";
  const cityDiff = reference && car.cityKmPerLiter ? Math.round((car.cityKmPerLiter - reference.cityKmPerLiterAvg) * 10) / 10 : null;
  const roadDiff = reference && car.roadKmPerLiter ? Math.round((car.roadKmPerLiter - reference.roadKmPerLiterAvg) * 10) / 10 : null;

  return (
    <section className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <Zap aria-hidden="true" className="text-[#D32F2F]" size={30} />
        <div>
          <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Comparar consumo</p>
          <h2 className="text-3xl font-black text-zinc-950">Rendimiento informado</h2>
        </div>
      </div>
      {hasConsumption ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-zinc-50 p-5">
            <p className="text-base font-black text-zinc-500">Ciudad</p>
            <p className="mt-2 text-4xl font-black text-zinc-950">{formatKmPerLiter(car.cityKmPerLiter)}</p>
            {cityDiff !== null ? <p className="mt-2 text-base font-bold text-zinc-600">Promedio categoría: {formatKmPerLiter(reference?.cityKmPerLiterAvg)}. Diferencia: {cityDiff > 0 ? "+" : ""}{cityDiff} km/l.</p> : null}
          </div>
          <div className="rounded-3xl bg-zinc-50 p-5">
            <p className="text-base font-black text-zinc-500">Ruta</p>
            <p className="mt-2 text-4xl font-black text-zinc-950">{formatKmPerLiter(car.roadKmPerLiter)}</p>
            {roadDiff !== null ? <p className="mt-2 text-base font-bold text-zinc-600">Promedio categoría: {formatKmPerLiter(reference?.roadKmPerLiterAvg)}. Diferencia: {roadDiff > 0 ? "+" : ""}{roadDiff} km/l.</p> : null}
          </div>
        </div>
      ) : (
        <p className="text-xl leading-9 text-zinc-700">No hay consumo disponible para este vehículo. Consultanos y lo verificamos.</p>
      )}
      <p className="mt-5 text-lg leading-8 text-zinc-600">
        La comparación usa la tabla fija editable por categoría configurada en el admin. Los datos pueden variar según manejo, mantenimiento, carga y condiciones de uso.
      </p>
    </section>
  );
}
