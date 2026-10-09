"use client";

import { useEffect, useState } from "react";
import { GitCompareArrows, X } from "lucide-react";
import { clsx } from "clsx";

const storageKey = "boulevard.compare.slugs";

function readSelection() {
  if (typeof window === "undefined") return [] as string[];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeSelection(slugs: string[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(slugs));
  window.dispatchEvent(new CustomEvent("boulevard:compare-change", { detail: slugs }));
}

export function CompareButton({ slug, label = "Comparar", className }: { slug: string; label?: string; className?: string }) {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const sync = () => setSelected(readSelection().includes(slug));
    sync();
    window.addEventListener("boulevard:compare-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("boulevard:compare-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);

  return (
    <button
      type="button"
      className={clsx(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-base font-black transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#D32F2F]",
        selected ? "bg-zinc-950 text-white" : "bg-white text-zinc-950 ring-1 ring-zinc-300 hover:bg-zinc-50",
        className,
      )}
      onClick={() => {
        const current = readSelection();
        if (current.includes(slug)) {
          writeSelection(current.filter((item) => item !== slug));
          setSelected(false);
          return;
        }
        writeSelection([...current, slug].slice(0, 3));
        setSelected(true);
      }}
      aria-pressed={selected}
    >
      {selected ? <X aria-hidden="true" size={20} /> : <GitCompareArrows aria-hidden="true" size={20} />}
      {selected ? "Quitar" : label}
    </button>
  );
}

export function getCompareStorageKey() {
  return storageKey;
}
