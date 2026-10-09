import Image from "next/image";
import Link from "next/link";
import { CarFront, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MobileMenu } from "@/components/layout/MobileMenu";

const navItems = [
  { href: "/autos", label: "Autos" },
  { href: "/comparar", label: "Comparar" },
  { href: "/financiacion", label: "Financiación" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/94 backdrop-blur supports-[backdrop-filter]:bg-white/84">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex min-w-0 items-center gap-3" href="/" aria-label="Ir al inicio de Boulevard Automóviles">
          <Image
            src={siteConfig.logoPath}
            alt="Logo de Boulevard Automóviles"
            width={260}
            height={67}
            priority
            className="h-10 w-auto mix-blend-multiply sm:h-12"
          />
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              className="rounded-full px-4 py-2 text-base font-bold text-zinc-800 transition hover:bg-zinc-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#D32F2F]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <ButtonLink href={`tel:${siteConfig.primaryPhoneTel}`} tone="secondary" className="min-h-11 px-5 text-base">
            <Phone aria-hidden="true" size={19} />
            Llamar
          </ButtonLink>
          <ButtonLink href="/autos" className="min-h-11 px-5 text-base">
            <CarFront aria-hidden="true" size={20} />
            Ver autos
          </ButtonLink>
        </div>

        <MobileMenu items={navItems} />
      </div>
    </header>
  );
}
