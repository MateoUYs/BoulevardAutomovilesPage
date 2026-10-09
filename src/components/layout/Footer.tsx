import Image from "next/image";
import Link from "next/link";
import { Camera, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { buildGeneralWhatsAppUrl } from "@/lib/site";

const footerLinks = [
  { href: "/autos", label: "Catálogo" },
  { href: "/comparar", label: "Comparador" },
  { href: "/financiacion", label: "Financiación" },
  { href: "/contacto", label: "Contacto" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <Image
            src={siteConfig.logoPath}
            alt="Boulevard Automóviles"
            width={280}
            height={96}
            className="mb-5 h-auto w-64 rounded-xl bg-white p-2"
          />
          <p className="max-w-xl text-lg leading-8 text-zinc-200">
            Boulevard Automóviles, automotora en Uruguay con local en {siteConfig.location}. Ventas, permutas, financiaciones y test drive con atención cercana y clara.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-black">Contacto directo</h2>
          <div className="grid gap-3 text-lg text-zinc-200">
            <a className="inline-flex items-center gap-2 hover:text-white" href={`tel:${siteConfig.primaryPhoneTel}`}>
              <Phone aria-hidden="true" size={20} />
              {siteConfig.primaryPhoneDisplay}
            </a>
            <a className="inline-flex items-center gap-2 hover:text-white" href={`tel:${siteConfig.secondaryPhoneTel}`}>
              <Phone aria-hidden="true" size={20} />
              {siteConfig.secondaryPhoneDisplay}
            </a>
            <a className="inline-flex items-center gap-2 hover:text-white" href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">
              <Camera aria-hidden="true" size={20} />
              {siteConfig.instagramHandle}
            </a>
            <a className="inline-flex items-center gap-2 hover:text-white" href={siteConfig.facebookUrl} target="_blank" rel="noreferrer">
              Facebook oficial
            </a>
            <a className="inline-flex items-center gap-2 hover:text-white" href={buildGeneralWhatsAppUrl()}>
              WhatsApp directo
            </a>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-black">Navegación</h2>
          <div className="grid gap-3 text-lg text-zinc-200">
            {footerLinks.map((link) => (
              <Link className="hover:text-white" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
            <span className="inline-flex items-center gap-2 pt-2 text-zinc-300">
              <MapPin aria-hidden="true" size={20} />
              {siteConfig.streetAddress}, {siteConfig.location}
            </span>
            <a className="hover:text-white" href={siteConfig.googleMapsUrl} target="_blank" rel="noreferrer">
              Ver en Google Maps
            </a>
            <span className="text-zinc-300">{siteConfig.businessHours}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-base text-zinc-400">
        Boulevard Automóviles. Precios en dólares estadounidenses. Datos sujetos a confirmación.
        <span className="mt-2 block text-sm text-zinc-500">
          Página realizada por{" "}
          <a
            href="https://www.instagram.com/lucastech.uy/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-zinc-400 underline-offset-4 hover:text-white hover:underline"
          >
            LucasTech
          </a>
        </span>
      </div>
    </footer>
  );
}
