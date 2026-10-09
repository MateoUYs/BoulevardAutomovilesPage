import { ButtonLink } from "@/components/ui/ButtonLink";
import { buildGeneralWhatsAppUrl } from "@/lib/site";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="bg-[#f6f7fb]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">{eyebrow}</p>
        <h1 className="mt-4 text-balance text-5xl font-black leading-tight tracking-tight text-zinc-950 sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-zinc-700">{description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/autos">Ver autos</ButtonLink>
          <ButtonLink href={buildGeneralWhatsAppUrl()} tone="secondary" target="_blank" rel="noreferrer">
            Consultar por WhatsApp
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
