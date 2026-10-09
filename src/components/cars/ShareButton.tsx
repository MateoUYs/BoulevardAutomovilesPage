"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-base font-black text-zinc-950 ring-1 ring-zinc-300 transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#D32F2F] sm:text-lg"
      onClick={async () => {
        if (navigator.share) {
          await navigator.share({ title, url });
          return;
        }
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }}
    >
      <Share2 aria-hidden="true" size={20} />
      {copied ? "Link copiado" : "Compartir"}
    </button>
  );
}
