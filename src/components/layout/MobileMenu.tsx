"use client";

import { useState } from "react";
import Link from "next/link";
import { CarFront, Menu, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";

type MobileMenuProps = {
  items: Array<{ href: string; label: string }>;
};

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label="Abrir menú"
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-zinc-300 bg-white px-4 font-extrabold text-zinc-950 transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#D32F2F]"
      >
        <Menu aria-hidden="true" size={24} />
      </button>

      {open ? (
        <div
          className="absolute right-0 mt-3 w-[min(88vw,340px)] rounded-3xl border border-zinc-200 bg-white p-3 shadow-2xl shadow-zinc-950/15"
          onClickCapture={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {items.map((item) => (
            <Link
              className="block rounded-2xl px-4 py-4 text-lg font-extrabold text-zinc-950 hover:bg-zinc-100"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3 grid gap-3 border-t border-zinc-200 pt-3">
            <Link
              href="/autos"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#D32F2F] px-6 py-3 text-base font-extrabold tracking-tight text-white shadow-lg shadow-red-900/20 transition duration-200 hover:bg-[#b92727] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#D32F2F] sm:text-lg"
            >
              <CarFront aria-hidden="true" size={20} />
              Ver autos
            </Link>
            <a
              href={`tel:${siteConfig.primaryPhoneTel}`}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-extrabold tracking-tight text-zinc-950 ring-1 ring-zinc-200 transition duration-200 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#D32F2F] sm:text-lg"
            >
              <Phone aria-hidden="true" size={19} />
              Llamar ahora
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
