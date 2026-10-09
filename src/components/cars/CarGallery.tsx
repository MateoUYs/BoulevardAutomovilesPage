"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { CarImage } from "@/components/cars/CarImage";
import type { PublicCarImage } from "@/lib/car-types";

export function CarGallery({ images, title }: { images: PublicCarImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const safeImages = images.length ? images : [];
  const image = safeImages[active];

  const goTo = (nextIndex: number) => {
    if (!safeImages.length) return;
    setActive((nextIndex + safeImages.length) % safeImages.length);
  };

  if (!image) {
    return <div className="flex h-[420px] items-center justify-center rounded-[2rem] bg-zinc-100 text-xl font-black text-zinc-500">Sin imágenes</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[2rem] bg-zinc-100 shadow-xl shadow-zinc-950/10">
        <button
          type="button"
          className="relative block h-[430px] w-full sm:h-[600px]"
          onClick={() => setZoomOpen(true)}
          aria-label={`Ampliar imagen de ${title}`}
        >
          <CarImage src={image.url} alt={`${title} en venta en Boulevard Automóviles`} priority className="object-contain p-2" sizes="(min-width: 1024px) 58vw, 100vw" />
          <span className="absolute right-4 top-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-white/95 px-4 text-base font-black text-zinc-950 shadow-lg">
            <Maximize2 aria-hidden="true" size={20} />
            Zoom
          </span>
        </button>

        {safeImages.length > 1 ? (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-zinc-950 shadow-lg hover:bg-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#D32F2F]"
              onClick={() => goTo(active - 1)}
              aria-label="Imagen anterior"
            >
              <ChevronLeft aria-hidden="true" size={32} />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-zinc-950 shadow-lg hover:bg-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#D32F2F]"
              onClick={() => goTo(active + 1)}
              aria-label="Imagen siguiente"
            >
              <ChevronRight aria-hidden="true" size={32} />
            </button>
          </>
        ) : null}
      </div>

      <div className="flex snap-x gap-3 overflow-x-auto pb-2" aria-label="Miniaturas del vehículo">
        {safeImages.map((item, index) => (
          <button
            type="button"
            key={`${item.url}-${index}`}
            onClick={() => setActive(index)}
            className="relative h-24 w-28 shrink-0 snap-start overflow-hidden rounded-2xl bg-zinc-100 ring-4 ring-transparent aria-current:ring-[#D32F2F] sm:h-28 sm:w-36"
            aria-current={active === index}
            aria-label={`Ver imagen ${index + 1}`}
          >
            <CarImage src={item.url} alt={`${title} imagen ${index + 1}`} className="object-contain p-1" sizes="144px" />
          </button>
        ))}
      </div>

      {zoomOpen ? (
        <div className="fixed inset-0 z-[70] bg-zinc-950/95 p-4" role="dialog" aria-modal="true" aria-label={`Imagen ampliada de ${title}`}>
          <button
            type="button"
            className="absolute right-4 top-4 z-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-zinc-950 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white"
            onClick={() => setZoomOpen(false)}
            aria-label="Cerrar zoom"
          >
            <X aria-hidden="true" size={30} />
          </button>
          <div className="relative h-full w-full">
            <CarImage src={image.url} alt={`${title} en venta en Boulevard Automóviles`} className="object-contain" sizes="100vw" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
