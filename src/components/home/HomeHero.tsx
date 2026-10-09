"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, BadgeCheck, CarFront, CircleDollarSign, PhoneCall } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { buildGeneralWhatsAppUrl, siteConfig } from "@/lib/site";

const quickStats = [
  "Ventas y permutas",
  "Financiaciones",
  "Test drive coordinado",
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-[#f6f7fb]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(211,47,47,0.16),transparent_34%),linear-gradient(135deg,rgba(23,43,103,0.10),transparent_42%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-base font-black text-[#172B67] shadow-sm ring-1 ring-zinc-200">
            <BadgeCheck aria-hidden="true" size={20} className="text-[#D32F2F]" />
            {siteConfig.experience}
          </div>
          <h1 className="text-balance text-5xl font-black leading-[0.96] tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
            Autos seleccionados para comprar con confianza.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-zinc-700 sm:text-2xl">
            Boulevard Automóviles en Uruguay: ventas, permutas, financiaciones y test drive con atención directa por WhatsApp o llamada.
          </p>

          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <ButtonLink href="/autos" className="w-full sm:w-auto">
              Ver autos
              <ArrowRight aria-hidden="true" size={22} />
            </ButtonLink>
            <ButtonLink href={buildGeneralWhatsAppUrl()} tone="dark" className="w-full sm:w-auto" target="_blank" rel="noreferrer">
              Consultar por WhatsApp
            </ButtonLink>
            <ButtonLink href={`tel:${siteConfig.primaryPhoneTel}`} tone="secondary" className="w-full sm:w-auto">
              <PhoneCall aria-hidden="true" size={22} />
              Llamar ahora
            </ButtonLink>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {quickStats.map((item) => (
              <div className="rounded-2xl bg-white p-4 text-lg font-extrabold text-zinc-900 shadow-sm ring-1 ring-zinc-200" key={item}>
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -right-4 -top-4 h-40 w-40 rounded-full bg-[#D32F2F] blur-3xl opacity-20" />
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-zinc-950 shadow-2xl shadow-zinc-950/25 ring-1 ring-black/10 sm:min-h-[640px] lg:min-h-[700px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(211,47,47,0.5),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.18),transparent_24%),linear-gradient(145deg,#050505,#172B67_52%,#D32F2F)]" />
            <div className="absolute inset-5 rounded-[1.6rem] border border-white/15" />
            <div className="relative flex min-h-[520px] flex-col justify-between p-6 text-white sm:min-h-[640px] sm:p-8 lg:min-h-[700px]">
              <Image
                src={siteConfig.logoPath}
                alt="Boulevard Automóviles"
                width={360}
                height={92}
                priority
                className="h-auto w-72 rounded-2xl bg-white p-3 shadow-2xl shadow-black/25"
              />
              <div>
                <div className="mb-4 inline-flex rounded-full bg-[#D32F2F] px-4 py-2 text-base font-black">{siteConfig.location}</div>
                <p className="max-w-md text-4xl font-black leading-tight sm:text-5xl">Compra-ventas, permutas y financiación con trato claro.</p>
                <p className="mt-5 max-w-lg text-xl leading-8 text-white/80">Stock real publicado por Boulevard Automóviles. Local en {siteConfig.streetAddress}, atención de 8:00 a 18:00.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function QuickAccess() {
  const items = [
    {
      title: "Catálogo",
      text: "Mirá autos publicados, filtrá y consultá directo por cada vehículo.",
      href: "/autos",
      icon: CarFront,
    },
    {
      title: "Financiación",
      text: "Consultas simples para encontrar una forma de pago posible.",
      href: "/financiacion",
      icon: CircleDollarSign,
    },
    {
      title: "Contacto",
      text: "WhatsApp, llamada directa, Instagram y ubicación del local.",
      href: "/contacto",
      icon: PhoneCall,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Accesos rápidos</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">Lo importante, a un toque.</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              className="group rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-950/10 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#D32F2F] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              href={item.href}
              key={item.title}
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#172B67] text-white transition group-hover:bg-[#D32F2F]">
                <Icon aria-hidden="true" size={28} />
              </div>
              <h3 className="text-2xl font-black text-zinc-950">{item.title}</h3>
              <p className="mt-3 text-lg leading-8 text-zinc-700">{item.text}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
