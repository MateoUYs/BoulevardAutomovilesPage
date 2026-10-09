"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GitCompareArrows, X } from "lucide-react";
import { getCompareStorageKey } from "@/components/cars/CompareButton";

function readSelection() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(getCompareStorageKey()) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeSelection(slugs: string[]) {
  window.localStorage.setItem(getCompareStorageKey(), JSON.stringify(slugs));
  window.dispatchEvent(new CustomEvent("boulevard:compare-change", { detail: slugs }));
}

export function CompareBar() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setSlugs(readSelection());
    sync();
    window.addEventListener("boulevard:compare-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("boulevard:compare-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!slugs.length) return null;

  const compareHref = `/comparar?autos=${slugs.join(",")}`;

  return (
    <div className="fixed inset-x-3 bottom-20 z-40 rounded-[1.5rem] bg-zinc-950 p-3 text-white shadow-2xl shadow-zinc-950/30 ring-1 ring-white/10 sm:inset-x-auto sm:bottom-7 sm:left-1/2 sm:w-[min(680px,calc(100vw-2rem))] sm:-translate-x-1/2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-base font-black sm:text-lg">
          <GitCompareArrows aria-hidden="true" className="text-[#D32F2F]" size={24} />
          {slugs.length === 1 ? "1 auto seleccionado — elegí otro para comparar" : `${slugs.length} autos seleccionados`}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-4 text-base font-black hover:bg-white/15"
            onClick={() => writeSelection([])}
          >
            <X aria-hidden="true" size={18} />
            Quitar
          </button>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#D32F2F] px-5 text-base font-black text-white hover:bg-[#b92727] aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href={compareHref}
            aria-disabled={slugs.length < 2}
          >
            Ver comparación
          </Link>
        </div>
      </div>
    </div>
  );
}
