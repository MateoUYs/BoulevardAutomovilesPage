import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BadgeDollarSign, CheckCircle2, Handshake, ShieldCheck } from "lucide-react";
import { StatusBadge, TagBadge } from "@/components/cars/CarBadges";
import { CarActions } from "@/components/cars/CarActions";
import { CarGallery } from "@/components/cars/CarGallery";
import { CarSpecsTable, CarSummary, ConsumptionPanel } from "@/components/cars/CarSpecsTable";
import {
  getAbsoluteCarUrl,
  getCarBySlug,
  getCarDisplayName,
  getCoverImage,
  getFuelLabel,
} from "@/lib/cars";
import { formatMileage, formatUsd } from "@/lib/format";
import { siteConfig } from "@/lib/site";

type CarPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CarPageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);

  if (!car) {
    return {
      title: "Auto no encontrado",
    };
  }

  const vehicleName = getCarDisplayName(car);
  const cover = getCoverImage(car);
  const url = getAbsoluteCarUrl(car, siteConfig.siteUrl);
  const description = `${vehicleName} en venta en Uruguay, disponible en Boulevard Automóviles. ${formatMileage(car.mileageKm)}. Precio ${formatUsd(car.priceUsd)}. Consultá por WhatsApp.`;

  return {
    title: `${vehicleName} en venta`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${vehicleName} | Boulevard Automóviles`,
      description,
      url,
      type: "website",
      images: cover ? [{ url: cover.url, alt: cover.alt, width: 900, height: 1200 }] : undefined,
    },
  };
}

export default async function CarPage({ params }: CarPageProps) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);

  if (!car) notFound();

  const vehicleName = getCarDisplayName(car);
  const vehicleUrl = getAbsoluteCarUrl(car, siteConfig.siteUrl);
  const cover = getCoverImage(car);

  const vehicleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: vehicleName,
    brand: { "@type": "Brand", name: car.brand },
    model: car.model,
    vehicleModelDate: String(car.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileageKm,
      unitCode: "KMT",
    },
    fuelType: getFuelLabel(car.fuelType),
    image: cover ? new URL(cover.url, siteConfig.siteUrl).toString() : undefined,
    url: vehicleUrl,
    offers: {
      "@type": "Offer",
      price: car.priceUsd,
      priceCurrency: "USD",
      availability: car.status === "VENDIDO" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      seller: {
        "@type": "AutoDealer",
        name: siteConfig.name,
        telephone: siteConfig.primaryPhoneTel,
      },
    },
  };

  return (
    <section className="bg-[#f6f7fb]">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link href="/autos" className="mb-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-base font-black text-zinc-950 ring-1 ring-zinc-200 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#D32F2F]">
          <ArrowLeft aria-hidden="true" size={20} />
          Volver al catálogo
        </Link>

        <div className="mb-8 flex flex-wrap gap-2">
          <StatusBadge status={car.status} />
          <TagBadge tag={car.tag} />
        </div>

        <div className="mb-8 max-w-4xl">
          <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Ficha del vehículo</p>
          <h1 className="mt-3 text-balance text-5xl font-black leading-tight tracking-tight text-zinc-950 sm:text-6xl">{vehicleName}</h1>
          {car.version ? <p className="mt-3 text-2xl font-black text-zinc-600">{car.version}</p> : null}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:items-start">
          <CarGallery images={car.images} title={vehicleName} />
          <div className="grid gap-5 lg:sticky lg:top-28">
            <CarSummary car={car} />
            <CarActions vehicleName={vehicleName} vehicleUrl={vehicleUrl} slug={car.slug} />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.72fr]">
          <CarSpecsTable car={car} />
          <ConsumptionPanel car={car} reference={null} />
        </div>

        {car.description ? (
          <section className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
            <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Descripción</p>
            <p className="mt-3 text-xl leading-9 text-zinc-700">{car.description}</p>
          </section>
        ) : null}

        <section className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Comprar con respaldo</p>
          <h2 className="mt-2 text-3xl font-black text-zinc-950">Consultá este vehículo con Boulevard Automóviles.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              [ShieldCheck, "Datos claros", "Ficha, precio y kilometraje publicados para consultar antes de coordinar."],
              [Handshake, "Permuta", "Podés consultar si tu vehículo puede tomarse como parte de pago."],
              [BadgeDollarSign, "Financiación", "Opciones bancarias sujetas a aprobación y requisitos."],
            ].map(([Icon, title, text]) => (
              <article className="rounded-3xl bg-zinc-50 p-5" key={title as string}>
                <Icon aria-hidden="true" className="text-[#D32F2F]" size={30} />
                <h3 className="mt-4 text-xl font-black text-zinc-950">{title as string}</h3>
                <p className="mt-2 text-lg leading-8 text-zinc-700">{text as string}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 inline-flex items-center gap-2 text-lg font-bold leading-8 text-zinc-700">
            <CheckCircle2 aria-hidden="true" className="shrink-0 text-[#D32F2F]" size={22} />
            Coordiná por WhatsApp, llamada o test drive para confirmar disponibilidad y condiciones.
          </p>
        </section>
      </div>
    </section>
  );
}
