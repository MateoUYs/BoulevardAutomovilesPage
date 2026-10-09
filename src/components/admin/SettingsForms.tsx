"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

type SiteSettingInput = {
  showSoldVehicles?: boolean;
  whatsappPhoneIntl?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  instagramUrl?: string;
  businessHours?: string | null;
  address?: string | null;
} | null;

type FuelInput = {
  gasolinePriceUyu: number;
  dieselPriceUyu: number;
  electricKwhUyu?: number | null;
  notes?: string | null;
};

type ReferenceInput = {
  category: string;
  cityKmPerLiterAvg: number;
  roadKmPerLiterAvg: number;
  notes?: string | null;
};

function numberValue(value: FormDataEntryValue | null) {
  return Number(String(value ?? "0").replace(",", "."));
}

function nullableText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

export function SettingsForms({ site, fuel, references }: { site: SiteSettingInput; fuel: FuelInput; references: ReferenceInput[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const submit = async (endpoint: string, payload: unknown, key: string) => {
    setMessage(null);
    setError(null);
    setLoading(key);
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(null);
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error ?? "No se pudo guardar.");
      return;
    }
    setMessage("Cambios guardados correctamente.");
    router.refresh();
  };

  return (
    <div className="grid gap-6">
      {message ? <p className="rounded-2xl bg-emerald-50 p-4 text-lg font-bold text-emerald-900">{message}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 p-4 text-lg font-bold text-red-800">{error}</p> : null}

      <form
        className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          void submit("/api/admin/settings", {
            showSoldVehicles: form.get("showSoldVehicles") === "on",
            whatsappPhoneIntl: String(form.get("whatsappPhoneIntl") ?? ""),
            primaryPhone: String(form.get("primaryPhone") ?? ""),
            secondaryPhone: String(form.get("secondaryPhone") ?? ""),
            instagramUrl: String(form.get("instagramUrl") ?? ""),
            businessHours: nullableText(form.get("businessHours")),
            address: nullableText(form.get("address")),
          }, "site");
        }}
      >
        <h2 className="text-3xl font-black text-zinc-950">Datos del sitio</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-base font-black text-zinc-950">WhatsApp internacional<input name="whatsappPhoneIntl" defaultValue={site?.whatsappPhoneIntl ?? "59800000000"} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold" /></label>
          <label className="grid gap-2 text-base font-black text-zinc-950">Teléfono principal<input name="primaryPhone" defaultValue={site?.primaryPhone ?? "000 000 000"} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold" /></label>
          <label className="grid gap-2 text-base font-black text-zinc-950">Teléfono secundario<input name="secondaryPhone" defaultValue={site?.secondaryPhone ?? ""} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold" /></label>
          <label className="grid gap-2 text-base font-black text-zinc-950">Instagram URL<input name="instagramUrl" defaultValue={site?.instagramUrl ?? ""} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold" /></label>
          <label className="grid gap-2 text-base font-black text-zinc-950">Horarios<input name="businessHours" defaultValue={site?.businessHours ?? ""} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold" /></label>
          <label className="grid gap-2 text-base font-black text-zinc-950">Dirección<input name="address" defaultValue={site?.address ?? "Rosario, Uruguay"} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold" /></label>
        </div>
        <label className="mt-5 flex items-center gap-3 text-lg font-black text-zinc-950"><input type="checkbox" name="showSoldVehicles" defaultChecked={site?.showSoldVehicles ?? false} className="h-5 w-5 accent-[#D32F2F]" /> Mostrar vendidos en el catálogo</label>
        <button disabled={loading === "site"} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#D32F2F] px-6 text-lg font-black text-white"><Save size={20} />Guardar datos</button>
      </form>

      <form
        className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          void submit("/api/admin/fuel-prices", {
            gasolinePriceUyu: numberValue(form.get("gasolinePriceUyu")),
            dieselPriceUyu: numberValue(form.get("dieselPriceUyu")),
            electricKwhUyu: numberValue(form.get("electricKwhUyu")),
            notes: nullableText(form.get("notes")),
          }, "fuel");
        }}
      >
        <h2 className="text-3xl font-black text-zinc-950">Precios de combustible</h2>
        <p className="mt-2 text-lg leading-8 text-zinc-700">Se usan para calcular el costo estimado cada 100 km en el comparador.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-base font-black text-zinc-950">Nafta por litro<input name="gasolinePriceUyu" type="number" step="0.01" defaultValue={fuel.gasolinePriceUyu} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold" /></label>
          <label className="grid gap-2 text-base font-black text-zinc-950">Gasoil por litro<input name="dieselPriceUyu" type="number" step="0.01" defaultValue={fuel.dieselPriceUyu} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold" /></label>
          <label className="grid gap-2 text-base font-black text-zinc-950">Electricidad kWh<input name="electricKwhUyu" type="number" step="0.01" defaultValue={fuel.electricKwhUyu ?? 0} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold" /></label>
        </div>
        <label className="mt-4 grid gap-2 text-base font-black text-zinc-950">Notas<input name="notes" defaultValue={fuel.notes ?? ""} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold" /></label>
        <button disabled={loading === "fuel"} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#D32F2F] px-6 text-lg font-black text-white"><Save size={20} />Guardar combustible</button>
      </form>

      <form
        className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const payload = references.map((reference) => ({
            category: reference.category,
            cityKmPerLiterAvg: numberValue(form.get(`${reference.category}-city`)),
            roadKmPerLiterAvg: numberValue(form.get(`${reference.category}-road`)),
            notes: nullableText(form.get(`${reference.category}-notes`)),
          }));
          void submit("/api/admin/consumption-references", { references: payload }, "references");
        }}
      >
        <h2 className="text-3xl font-black text-zinc-950">Referencias de consumo</h2>
        <p className="mt-2 text-lg leading-8 text-zinc-700">Tabla fija editable por categoría. No se calculan promedios inventados.</p>
        <div className="mt-5 grid gap-4">
          {references.map((reference) => (
            <div key={reference.category} className="grid gap-3 rounded-3xl bg-zinc-50 p-4 md:grid-cols-[160px_1fr_1fr_1.4fr] md:items-end">
              <p className="text-xl font-black text-zinc-950">{reference.category}</p>
              <label className="grid gap-2 text-base font-black text-zinc-950">Ciudad km/l<input name={`${reference.category}-city`} type="number" step="0.1" defaultValue={reference.cityKmPerLiterAvg} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold" /></label>
              <label className="grid gap-2 text-base font-black text-zinc-950">Ruta km/l<input name={`${reference.category}-road`} type="number" step="0.1" defaultValue={reference.roadKmPerLiterAvg} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold" /></label>
              <label className="grid gap-2 text-base font-black text-zinc-950">Notas<input name={`${reference.category}-notes`} defaultValue={reference.notes ?? ""} className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold" /></label>
            </div>
          ))}
        </div>
        <button disabled={loading === "references"} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#D32F2F] px-6 text-lg font-black text-white"><Save size={20} />Guardar referencias</button>
      </form>
    </div>
  );
}
