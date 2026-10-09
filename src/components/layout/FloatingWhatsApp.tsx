import { MessageCircle } from "lucide-react";
import { buildGeneralWhatsAppUrl } from "@/lib/site";

export function FloatingWhatsApp() {
  return (
    <a
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] p-0 text-base font-black text-zinc-950 shadow-2xl shadow-zinc-950/25 transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] motion-reduce:transition-none motion-reduce:hover:scale-100 sm:bottom-7 sm:right-7 sm:w-auto sm:gap-3 sm:px-5 sm:text-lg"
      href={buildGeneralWhatsAppUrl()}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle aria-hidden="true" size={24} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
