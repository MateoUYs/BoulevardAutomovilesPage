import { CalendarCheck, MessageCircle, PhoneCall } from "lucide-react";
import { CompareButton } from "@/components/cars/CompareButton";
import { ShareButton } from "@/components/cars/ShareButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { buildTestDriveWhatsAppUrl, buildVehicleWhatsAppUrl, siteConfig } from "@/lib/site";

export function CarActions({ vehicleName, vehicleUrl, slug }: { vehicleName: string; vehicleUrl: string; slug: string }) {
  return (
    <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-lg font-bold leading-8 text-zinc-700">Si no tenés WhatsApp abierto, podés llamarnos directo.</p>
      <div className="mt-5 grid gap-3">
        <ButtonLink href={buildVehicleWhatsAppUrl(vehicleName, vehicleUrl)} target="_blank" rel="noreferrer" className="w-full">
          <MessageCircle aria-hidden="true" size={22} />
          Consultar por WhatsApp
        </ButtonLink>
        <ButtonLink href={buildTestDriveWhatsAppUrl(vehicleName, vehicleUrl)} target="_blank" rel="noreferrer" tone="dark" className="w-full">
          <CalendarCheck aria-hidden="true" size={22} />
          Agendar Test Drive
        </ButtonLink>
        <div className="grid gap-3 sm:grid-cols-2">
          <ButtonLink href={`tel:${siteConfig.primaryPhoneTel}`} tone="secondary" className="w-full">
            <PhoneCall aria-hidden="true" size={21} />
            Llamar ahora
          </ButtonLink>
          <CompareButton slug={slug} className="w-full" />
        </div>
        <ShareButton title={vehicleName} url={vehicleUrl} />
      </div>
    </div>
  );
}
