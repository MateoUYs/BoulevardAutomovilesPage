import type { Metadata } from "next";
import { BadgeCheck, CarFront, Handshake, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { buildGeneralWhatsAppUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quiénes somos | Boulevard Automóviles Uruguay",
  description: "Conocé Boulevard Automóviles, automotora en Uruguay con local en Rosario y más de 20 años en venta de autos, permutas y financiación.",
  alternates: { canonical: "/quienes-somos" },
};

const highlights = [
  {
    title: "Más de 20 años",
    text: "Experiencia en el rubro automotor acompañando compradores de Uruguay.",
    icon: BadgeCheck,
  },
  {
    title: "Autos seleccionados",
    text: "Stock publicado con datos claros, fotos reales y consultas directas por cada vehículo.",
    icon: CarFront,
  },
  {
    title: "Permutas y financiación",
    text: "Opciones para comprar, vender o permutar con una atención personalizada.",
    icon: Handshake,
  },
];

export default function QuienesSomosPage() {
  return (
    <section className="bg-[#f6f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Quiénes somos</p>
          <h1 className="mt-4 text-balance text-5xl font-black leading-tight tracking-tight text-zinc-950 sm:text-6xl">
            Boulevard Automóviles, automotora en Uruguay.
          </h1>
          <p className="mt-6 text-xl leading-9 text-zinc-700">
            En Boulevard Automóviles trabajamos hace más de 20 años en el rubro automotor. Somos una automotora uruguaya con local en {siteConfig.streetAddress}, {siteConfig.postalCode} {siteConfig.location}, dedicada a la venta de autos, compra de vehículos, permutas y financiación bancaria.
          </p>
          <p className="mt-4 text-xl leading-9 text-zinc-700">
            Nuestro objetivo es que cada cliente pueda consultar con confianza, comparar opciones y avanzar con información clara antes de comprar o permutar su vehículo.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm" key={item.title}>
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#172B67] text-white">
                  <Icon aria-hidden="true" size={28} />
                </div>
                <h2 className="text-2xl font-black text-zinc-950">{item.title}</h2>
                <p className="mt-3 text-lg leading-8 text-zinc-700">{item.text}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-lg font-black text-[#172B67]">
                <MapPin aria-hidden="true" size={22} />
                {siteConfig.streetAddress}, {siteConfig.location}
              </p>
              <h2 className="mt-3 text-3xl font-black text-zinc-950">Atención directa para clientes de Uruguay.</h2>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-zinc-700">
                Consultá por autos disponibles, permutas, financiación bancaria o coordinación de test drive. Atendemos {siteConfig.businessHours.toLowerCase()} y respondemos por WhatsApp o llamada para que tengas una respuesta rápida y clara.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:min-w-56">
              <ButtonLink href="/autos">Ver autos</ButtonLink>
              <ButtonLink href={buildGeneralWhatsAppUrl()} tone="secondary" target="_blank" rel="noreferrer">
                Consultar
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
