import Image from "next/image";
import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ingreso admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <section className="min-h-screen bg-[#f6f7fb] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-md rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-950/10 sm:p-8">
        <Image src={siteConfig.logoPath} alt="Boulevard Automóviles" width={320} height={110} priority className="mx-auto mb-8 h-auto w-72" />
        <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Panel privado</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-950">Ingresar al admin</h1>
        <p className="mt-3 text-lg leading-8 text-zinc-700">Sin registro público. El usuario se crea por seed o variables de entorno.</p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-lg font-bold text-zinc-700">Cargando formulario...</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
