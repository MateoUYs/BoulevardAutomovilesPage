import { ButtonLink } from "@/components/ui/ButtonLink";
import { buildGeneralWhatsAppUrl } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="bg-[#f6f7fb]">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">404</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight text-zinc-950 sm:text-6xl">No encontramos esta página.</h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl leading-9 text-zinc-700">
          Puede que el enlace haya cambiado. Podés volver al catálogo o consultar directo por WhatsApp.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/autos">Ir al catálogo</ButtonLink>
          <ButtonLink href={buildGeneralWhatsAppUrl()} tone="secondary" target="_blank" rel="noreferrer">
            Consultar por WhatsApp
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
