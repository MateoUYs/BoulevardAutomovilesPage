import Link from "next/link";
import { Fuel, Gauge, PhoneCall } from "lucide-react";
import { CarImage } from "@/components/cars/CarImage";
import { CompareButton } from "@/components/cars/CompareButton";
import { StatusBadge, TagBadge } from "@/components/cars/CarBadges";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { formatMileage, formatUsd } from "@/lib/format";
import { buildVehicleWhatsAppUrl, siteConfig } from "@/lib/site";
import { getAbsoluteCarUrl, getCarDisplayName, getCarPublicUrl, getCoverImage, getFuelLabel } from "@/lib/cars";
import type { PublicCar } from "@/lib/car-types";

export function CarCard({ car }: { car: PublicCar }) {
  const cover = getCoverImage(car);
  const vehicleName = getCarDisplayName(car);
  const publicUrl = getCarPublicUrl(car);
  const absoluteUrl = getAbsoluteCarUrl(car, siteConfig.siteUrl);

  return (
    <article className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-950/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <Link href={publicUrl} prefetch={false} className="group relative block h-96 bg-zinc-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#D32F2F]">
        {cover ? (
          <CarImage src={cover.url} alt={`${vehicleName} en venta en Boulevard Automóviles`} className="object-cover transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        ) : null}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <StatusBadge status={car.status} />
          <TagBadge tag={car.tag} />
        </div>
      </Link>

      <div className="p-5">
        <Link href={publicUrl} prefetch={false} className="focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#D32F2F]">
          <h2 className="text-2xl font-black text-zinc-950">{vehicleName}</h2>
          {car.version ? <p className="mt-1 text-lg font-bold text-zinc-600">{car.version}</p> : null}
        </Link>

        <div className="mt-4 grid grid-cols-2 gap-3 text-lg text-zinc-700">
          <span className="inline-flex items-center gap-2"><Gauge aria-hidden="true" size={20} />{formatMileage(car.mileageKm)}</span>
          <span className="inline-flex items-center gap-2"><Fuel aria-hidden="true" size={20} />{getFuelLabel(car.fuelType)}</span>
        </div>

        <p className="mt-4 text-3xl font-black text-[#172B67]">{formatUsd(car.priceUsd)}</p>

        <div className="mt-5 grid gap-3">
          <ButtonLink href={buildVehicleWhatsAppUrl(vehicleName, absoluteUrl)} target="_blank" rel="noreferrer" className="w-full">
            Consultar por WhatsApp
          </ButtonLink>
          <div className="grid grid-cols-2 gap-3">
            <CompareButton slug={car.slug} className="w-full" />
            <ButtonLink href={`tel:${siteConfig.primaryPhoneTel}`} tone="secondary" className="w-full px-3">
              <PhoneCall aria-hidden="true" size={19} />
              Llamar
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}
