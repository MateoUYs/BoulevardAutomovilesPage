import Image from "next/image";
import Link from "next/link";
import { CarFront, Gauge, Home, Settings } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { siteConfig } from "@/lib/site";

const adminLinks = [
  { href: "/admin", label: "Resumen", icon: Gauge },
  { href: "/admin/autos", label: "Autos", icon: CarFront },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminShell({ children, adminName }: { children: React.ReactNode; adminName: string }) {
  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src={siteConfig.logoPath} alt="Boulevard Automóviles" width={210} height={54} className="h-10 w-auto sm:h-12" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-base font-black text-zinc-700 sm:inline">{adminName}</span>
            <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-base font-black text-zinc-950 ring-1 ring-zinc-300 hover:bg-zinc-50">
              <Home aria-hidden="true" size={18} />
              Ver sitio
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="rounded-[2rem] border border-zinc-200 bg-white p-3 shadow-sm lg:sticky lg:top-6 lg:h-fit">
          <nav className="grid gap-2" aria-label="Navegación admin">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="inline-flex min-h-12 items-center gap-3 rounded-2xl px-4 text-lg font-black text-zinc-950 hover:bg-zinc-100">
                  <Icon aria-hidden="true" size={22} className="text-[#D32F2F]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
