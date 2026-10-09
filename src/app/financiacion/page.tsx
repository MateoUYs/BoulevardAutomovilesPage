import type { Metadata } from "next";
import { CheckCircle2, ClipboardCheck, Handshake, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { buildGeneralWhatsAppUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Financiación y permutas para autos",
  description: "Financiación bancaria y permutas para comprar autos en Boulevard Automóviles, automotora en Rosario, Uruguay.",
  alternates: { canonical: "/financiacion" },
};

export default function FinanciacionPage() {
  const requisitos = [
    "Tener recibo de sueldo.",
    "Contar con 6 meses de antigüedad laboral como mínimo.",
    "No estar en clearing.",
  ];
  const steps = [
    [MessageCircle, "Consultás el vehículo", "Enviás el auto que te interesa por WhatsApp o llamás al local."],
    [ClipboardCheck, "Revisamos requisitos", "Se confirma documentación básica y condiciones sujetas a aprobación bancaria."],
    [Handshake, "Coordinamos la operación", "También podés consultar permuta como parte de pago."],
  ];

  return (
    <section className="bg-[#f6f7fb]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Financiación y permutas</p>
        <h1 className="mt-4 text-balance text-5xl font-black leading-tight tracking-tight text-zinc-950 sm:text-6xl">
          Consultas claras para comprar o permutar.
        </h1>

        <div className="mt-8 max-w-3xl rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-base font-black uppercase tracking-[0.18em] text-[#D32F2F]">Financiación bancaria</p>
          <p className="mt-4 text-2xl font-black leading-9 text-zinc-950">
            Hasta 100% financiado y en 60 cuotas como máximo.
          </p>

          <div className="mt-6">
            <h2 className="text-xl font-black text-zinc-950">Requisitos</h2>
            <ul className="mt-4 grid gap-3 text-xl leading-8 text-zinc-700">
              {requisitos.map((requisito) => (
                <li className="flex gap-3" key={requisito}>
                  <CheckCircle2 aria-hidden="true" className="mt-1 shrink-0 text-[#D32F2F]" size={24} />
                  <span>{requisito}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/autos">Ver autos</ButtonLink>
          <ButtonLink href={buildGeneralWhatsAppUrl()} tone="secondary" target="_blank" rel="noreferrer">
            Consultar por WhatsApp
          </ButtonLink>
        </div>

        <section className="mt-12">
          <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Cómo funciona</p>
          <h2 className="mt-3 text-3xl font-black text-zinc-950">Una consulta simple antes de avanzar.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map(([Icon, title, text]) => (
              <article className="rounded-[1.6rem] border border-zinc-200 bg-white p-5 shadow-sm" key={title as string}>
                <Icon aria-hidden="true" className="text-[#D32F2F]" size={30} />
                <h3 className="mt-4 text-2xl font-black text-zinc-950">{title as string}</h3>
                <p className="mt-2 text-lg leading-8 text-zinc-700">{text as string}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700">
            Las condiciones finales dependen de aprobación bancaria, perfil del cliente y documentación presentada. Boulevard Automóviles acompaña la consulta para que tengas una respuesta clara.
          </p>
        </section>
      </div>
    </section>
  );
}
