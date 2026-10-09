import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { buildGeneralWhatsAppUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto | Boulevard Automóviles Uruguay",
  description: "Contactá a Boulevard Automóviles en Uruguay. Local en Rosario, WhatsApp, llamadas, Instagram, venta de autos, permutas y financiación.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  const mapSrc = siteConfig.googleMapsEmbedUrl;

  return (
    <section className="bg-[#f6f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Contacto</p>
        <h1 className="mt-4 text-balance text-5xl font-black leading-tight tracking-tight text-zinc-950 sm:text-6xl">
          Hablá directo con Boulevard Automóviles.
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-zinc-700">
          En Boulevard Automóviles contamos con más de 20 años de experiencia en el rubro automotor. Nuestro local está en {siteConfig.streetAddress}, {siteConfig.postalCode} {siteConfig.location}, y atendemos {siteConfig.businessHours.toLowerCase()}. Nos especializamos en compra, venta y permuta de vehículos, con opciones de financiación y atención personalizada.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <ButtonLink href={buildGeneralWhatsAppUrl()} target="_blank" rel="noreferrer">
            Consultar por WhatsApp
          </ButtonLink>
          <ButtonLink href={`tel:${siteConfig.primaryPhoneTel}`} tone="secondary">
            <Phone aria-hidden="true" size={22} />
            Llamar {siteConfig.primaryPhoneDisplay}
          </ButtonLink>
          <ButtonLink href={`tel:${siteConfig.secondaryPhoneTel}`} tone="ghost" className="sm:col-span-2">
            <Phone aria-hidden="true" size={22} />
            Llamar {siteConfig.secondaryPhoneDisplay}
          </ButtonLink>
          {siteConfig.googleMapsUrl ? (
            <ButtonLink href={siteConfig.googleMapsUrl} tone="ghost" className="sm:col-span-2" target="_blank" rel="noreferrer">
              Ver ubicación en Google Maps
            </ButtonLink>
          ) : null}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <div className="grid gap-4">
            {[
              [MapPin, "Dirección", `${siteConfig.streetAddress}, ${siteConfig.postalCode} ${siteConfig.location}`],
              [Clock, "Horario", siteConfig.businessHours],
              [MessageCircle, "Consultas", "WhatsApp, llamada directa, permutas, financiación y coordinación de test drive."],
            ].map(([Icon, title, text]) => (
              <article className="rounded-[1.6rem] border border-zinc-200 bg-white p-5 shadow-sm" key={title as string}>
                <Icon aria-hidden="true" className="text-[#D32F2F]" size={30} />
                <h2 className="mt-4 text-2xl font-black text-zinc-950">{title as string}</h2>
                <p className="mt-2 text-lg leading-8 text-zinc-700">{text as string}</p>
              </article>
            ))}
          </div>
          {mapSrc ? (
            <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
              <iframe
                src={mapSrc}
                title="Ubicación de Boulevard Automóviles en Rosario, Uruguay"
                className="h-[420px] w-full border-0 lg:h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
