import type { Metadata } from "next";
import { CheckCircle2, Fuel, Gauge, ShieldCheck } from "lucide-react";
import { CarCard } from "@/components/cars/CarCard";
import { HomeHero, QuickAccess } from "@/components/home/HomeHero";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getFeaturedCars } from "@/lib/cars";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Boulevard Automóviles | Automotora en Uruguay",
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Boulevard Automóviles | Automotora en Uruguay",
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    images: [{ url: siteConfig.ogImagePath, width: 1200, height: 630, alt: "Boulevard Automóviles, automotora en Uruguay" }],
  },
};

const faqs = [
  {
    question: "¿Dónde queda Boulevard Automóviles?",
    answer: `Boulevard Automóviles está en ${siteConfig.streetAddress}, ${siteConfig.postalCode} ${siteConfig.location}.`,
  },
  {
    question: "¿Qué servicios ofrece Boulevard Automóviles?",
    answer: "Ofrece venta de autos, compra de vehículos, permutas, financiación bancaria y consultas directas por WhatsApp o llamada para clientes de Uruguay.",
  },
  {
    question: "¿Boulevard Automóviles acepta permutas?",
    answer: "Sí, se pueden consultar permutas de vehículos directamente con el local para evaluar cada caso.",
  },
  {
    question: "¿Hay financiación para comprar autos?",
    answer: "Sí, Boulevard Automóviles trabaja con financiación bancaria, con opciones de hasta 100% financiado y hasta 60 cuotas, sujetas a aprobación.",
  },
];

export const revalidate = 60;

export default async function Home() {
  const featuredCars = await getFeaturedCars(3);

  const autoDealerJsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}${siteConfig.logoPath}`,
    telephone: [siteConfig.primaryPhoneTel, siteConfig.secondaryPhoneTel],
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.streetAddress,
        addressLocality: siteConfig.addressLocality,
        addressRegion: siteConfig.addressRegion,
        postalCode: siteConfig.postalCode,
        addressCountry: siteConfig.addressCountry,
      },
      openingHours: siteConfig.openingHours,
      hasMap: siteConfig.googleMapsUrl,
      sameAs: [siteConfig.instagramUrl, siteConfig.facebookUrl, siteConfig.googleMapsUrl],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeHero />
      <QuickAccess />

      <section className="bg-zinc-950 py-14 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
          <div>
            <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Confianza Boulevard</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Un proceso claro para elegir mejor.</h2>
            <p className="mt-5 text-xl leading-9 text-zinc-300">
              La web está pensada para que cualquier persona pueda ver autos, comparar opciones y consultar sin pasos raros.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [ShieldCheck, "Datos revisados", "Las fichas técnicas automáticas se publican solo después de confirmación humana."],
              [CheckCircle2, "WhatsApp y llamada", "Si WhatsApp no está iniciado, siempre queda la llamada directa como segunda opción."],
              [Gauge, "Comparador simple", "Precio, kilometraje, consumo y costo estimado cada 100 km lado a lado."],
              [Fuel, "Consumo responsable", "Los promedios salen de tablas configurables, no de números inventados."],
            ].map(([Icon, title, text]) => (
              <div className="rounded-[1.6rem] bg-white/8 p-5 ring-1 ring-white/10" key={title as string}>
                <Icon aria-hidden="true" className="mb-4 text-[#D32F2F]" size={30} />
                <h3 className="text-2xl font-black">{title as string}</h3>
                <p className="mt-3 text-lg leading-8 text-zinc-300">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Vehículos disponibles</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">Últimos ingresos.</h2>
          </div>
          <ButtonLink href="/autos" tone="ghost">Ver catálogo completo</ButtonLink>
        </div>

        {featuredCars.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredCars.map((car) => <CarCard car={car} key={car.id} />)}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-2xl font-black text-zinc-950">Próximamente nuevos vehículos publicados.</h3>
            <p className="mt-3 text-lg leading-8 text-zinc-700">Consultá por WhatsApp para conocer el stock actual de Boulevard Automóviles.</p>
            <ButtonLink href="/contacto" className="mt-5">Contactar</ButtonLink>
          </div>
        )}
      </section>

      <section className="bg-[#f6f7fb] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Boulevard Automoviles Uruguay</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">Automotora en Uruguay con local en Rosario.</h2>
            <p className="mt-5 text-xl leading-9 text-zinc-700">
              Más de 20 años en el rubro automotor, con atención directa para venta de autos, permutas y financiación bancaria. Atendemos en {siteConfig.streetAddress}, {siteConfig.postalCode} {siteConfig.location}, de {siteConfig.businessHours.toLowerCase()}.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((item) => (
              <article className="rounded-[1.6rem] border border-zinc-200 bg-white p-6 shadow-sm" key={item.question}>
                <h3 className="text-2xl font-black text-zinc-950">{item.question}</h3>
                <p className="mt-3 text-lg leading-8 text-zinc-700">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
