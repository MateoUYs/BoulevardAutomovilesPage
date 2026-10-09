"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

type CarImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function CarImage({ src, alt, className, sizes, priority = false }: CarImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-zinc-100 to-zinc-200 p-5 text-center text-zinc-500">
        <ImageOff aria-hidden="true" size={40} />
        <span className="text-sm font-black uppercase tracking-wide">Foto no disponible temporalmente</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      unoptimized
      className={className}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
