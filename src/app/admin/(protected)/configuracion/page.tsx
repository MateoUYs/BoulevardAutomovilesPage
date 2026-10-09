import { getAdminSettings } from "@/lib/admin-data";
import { SettingsForms } from "@/components/admin/SettingsForms";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-base font-black uppercase tracking-[0.22em] text-[#D32F2F]">Configuración</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">Datos editables del sitio</h1>
        <p className="mt-3 text-xl leading-9 text-zinc-700">Editá contacto, visibilidad de vendidos, precios de combustible y referencias de consumo por categoría.</p>
      </section>
      <SettingsForms site={settings.site} fuel={settings.fuel} references={settings.references} />
    </div>
  );
}
