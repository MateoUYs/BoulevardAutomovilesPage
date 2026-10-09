import Link from "next/link";
import { CarImage } from "@/components/cars/CarImage";
import { CompareButton } from "@/components/cars/CompareButton";
import { StatusBadge, TagBadge } from "@/components/cars/CarBadges";
import { formatMileage, formatUsd } from "@/lib/format";
import { getCarDisplayName, getCarPublicUrl, getCoverImage, getFuelLabel } from "@/lib/cars";
import type { PublicCar } from "@/lib/car-types";

export function CompareSelectionGrid({ cars }: { cars: PublicCar[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {cars.map((car) => {
        const cover = getCoverImage(car);
        const name = getCarDisplayName(car);

        return (
          <article key={car.id} className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
            <div className="relative h-64 bg-zinc-100">
              {cover ? <CarImage src={cover.url} alt={cover.alt} className="object-contain p-2" sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" /> : null}
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <StatusBadge status={car.status} />
                <TagBadge tag={car.tag} />
              </div>
            </div>
            <div className="p-5">
              <h2 className="text-2xl font-black text-zinc-950">{name}</h2>
              {car.version ? <p className="mt-1 text-lg font-bold text-zinc-600">{car.version}</p> : null}
              <div className="mt-4 grid grid-cols-2 gap-3 text-base font-bold text-zinc-700">
                <span>{formatMileage(car.mileageKm)}</span>
                <span>{getFuelLabel(car.fuelType)}</span>
              </div>
              <p className="mt-4 text-3xl font-black text-[#172B67]">{formatUsd(car.priceUsd)}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <CompareButton slug={car.slug} className="w-full" label="Elegir" />
                <Link href={getCarPublicUrl(car)} className="inline-flex min-h-12 items-center justify-center rounded-full bg-zinc-100 px-5 text-base font-black text-zinc-950 hover:bg-zinc-200">
                  Ver ficha
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
