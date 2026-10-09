"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ImageUp, Plus, Save, Trash2 } from "lucide-react";
import type { PublicCar, PublicCarImage } from "@/lib/car-types";

type CarFormProps = {
  car?: PublicCar;
};

const emptyToNull = (value: FormDataEntryValue | null) => {
  const text = String(value ?? "").trim();
  return text ? text : null;
};

const numberOrNull = (value: FormDataEntryValue | null) => {
  const text = String(value ?? "").trim();
  return text ? Number(text) : null;
};

const makeEmptyImage = (order: number): PublicCarImage => ({ url: "", alt: "", order, isCover: order === 0 });

async function compressImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const maxSide = 1600;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo procesar la imagen.");
  context.drawImage(bitmap, 0, 0, width, height);

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("No se pudo comprimir la imagen."));
          return;
        }
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" }));
      },
      "image/webp",
      0.82,
    );
  });
}

const selectOptions = {
  condition: ["NUEVO", "USADO"],
  status: ["BORRADOR", "PUBLICADO", "RESERVADO", "VENDIDO"],
  category: ["", "SEDAN", "HATCHBACK", "SUV", "PICKUP", "UTILITARIO", "OTRO"],
  fuelType: ["", "NAFTA", "DIESEL", "HIBRIDO", "ELECTRICO", "FLEX", "OTRO"],
  transmission: ["", "MANUAL", "AUTOMATICA", "CVT", "OTRA"],
  specsSource: ["", "NHTSA", "FUELECONOMY", "CARQUERY", "AI_ESTIMADO", "MANUAL"],
  tag: ["", "CERO_KM", "RECIEN_INGRESADO", "OPORTUNIDAD", "FINANCIABLE"],
};

function TextInput({ label, name, defaultValue, type = "text", required = false, step, placeholder }: { label: string; name: string; defaultValue?: string | number | null; type?: string; required?: boolean; step?: string; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-base font-black text-zinc-950">
      {label}
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100"
      />
    </label>
  );
}

function SelectInput({ label, name, defaultValue, options }: { label: string; name: string; defaultValue?: string | null; options: string[] }) {
  return (
    <label className="grid gap-2 text-base font-black text-zinc-950">
      {label}
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100"
      >
        {options.map((option) => <option key={option} value={option}>{option || "Sin definir"}</option>)}
      </select>
    </label>
  );
}

export function CarForm({ car }: CarFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [images, setImages] = useState<PublicCarImage[]>(car?.images.length ? car.images : [makeEmptyImage(0), makeEmptyImage(1), makeEmptyImage(2)]);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, string>>({});
  const [specsWarning, setSpecsWarning] = useState<string | null>(car?.specsReviewNote ?? null);
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [searchingSpecs, setSearchingSpecs] = useState(false);

  const updateImage = (index: number, patch: Partial<PublicCarImage>) => {
    setImages((current) => current.map((image, itemIndex) => itemIndex === index ? { ...image, ...patch } : image));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const clone = [...current];
      const [item] = clone.splice(index, 1);
      clone.splice(nextIndex, 0, item);
      return clone.map((image, order) => ({ ...image, order }));
    });
  };

  const setCover = (index: number) => {
    setImages((current) => current.map((image, itemIndex) => ({ ...image, isCover: itemIndex === index })));
  };

  const removeImage = (index: number) => {
    setImages((current) => {
      const next = current.filter((_, itemIndex) => itemIndex !== index).map((item, order) => ({ ...item, order }));
      const hasCover = next.some((item) => item.isCover);
      return next.map((item, itemIndex) => ({ ...item, isCover: hasCover ? item.isCover : itemIndex === 0 }));
    });
  };

  const uploadImage = async (index: number, file: File) => {
    setError(null);
    setImageErrors((current) => ({ ...current, [index]: "" }));
    setUploadingIndex(index);
    const previewUrl = URL.createObjectURL(file);
    updateImage(index, { url: previewUrl, alt: images[index]?.alt || "Auto en Boulevard Automóviles" });

    try {
      const compressed = await compressImage(file).catch(() => file);
      const formData = new FormData();
      formData.set("file", compressed);
      const response = await fetch("/api/admin/uploads", { method: "POST", body: formData });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? "No se pudo subir la imagen.");
      updateImage(index, { url: data.url });
    } catch (uploadError) {
      updateImage(index, { url: "" });
      setImageErrors((current) => ({
        ...current,
        [index]: uploadError instanceof Error ? uploadError.message : "No se pudo subir la imagen.",
      }));
    } finally {
      URL.revokeObjectURL(previewUrl);
      setUploadingIndex(null);
    }
  };

  const setFieldValue = (name: string, value: string | number | null | undefined) => {
    const field = formRef.current?.elements.namedItem(name);
    if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
      field.value = value === null || value === undefined ? "" : String(value);
    }
  };

  const searchSpecs = async () => {
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    const brand = String(formData.get("brand") ?? "").trim();
    const model = String(formData.get("model") ?? "").trim();
    const year = Number(formData.get("year"));
    const category = emptyToNull(formData.get("category"));
    if (!brand || !model || !year) {
      setError("Ingresá marca, modelo y año antes de buscar la ficha técnica.");
      return;
    }

    setError(null);
    setSearchingSpecs(true);
    let data: { specs?: Record<string, string | number | null | undefined>; error?: string } | null = null;
    try {
      const response = await fetch("/api/admin/specs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, model, year, category }),
      });
      data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? "No se pudo buscar la ficha técnica.");
        return;
      }
    } catch {
      setError("No se pudo buscar la ficha técnica. Revisá la conexión y probá de nuevo.");
      return;
    } finally {
      setSearchingSpecs(false);
    }

    if (!data) {
      setError("No se recibió respuesta de la búsqueda automática.");
      return;
    }

    const specs = data.specs ?? {};
    setFieldValue("engine", specs.engine);
    setFieldValue("engineCapacity", specs.engineCapacity);
    setFieldValue("powerHp", specs.powerHp);
    setFieldValue("tankCapacityL", specs.tankCapacityL);
    setFieldValue("doors", specs.doors);
    setFieldValue("seats", specs.seats);
    setFieldValue("cityKmPerLiter", specs.cityKmPerLiter);
    setFieldValue("roadKmPerLiter", specs.roadKmPerLiter);
    setFieldValue("fuelType", specs.fuelType);
    setFieldValue("transmission", specs.transmission);
    setFieldValue("specsSource", specs.source);
    setFieldValue("safetyNotes", specs.safetyNotes);
    setFieldValue("specsReviewNote", specs.warning);
    setSpecsWarning(String(specs.warning ?? "Ficha encontrada. Revisala antes de publicar."));

    const reviewed = form.elements.namedItem("specsReviewed");
    if (reviewed instanceof HTMLInputElement) reviewed.checked = false;
  };

  return (
    <form
      ref={formRef}
      className="grid gap-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);
        const form = new FormData(event.currentTarget);
        const uploadedImages = images
          .filter((image) => image.url.trim() && !image.url.startsWith("blob:"))
          .map((image, order) => ({
            ...image,
            alt: image.alt.trim() || "Auto en Boulevard Automóviles",
            order,
          }));

        if (uploadedImages.length < 3) {
          setError("Cargá al menos 3 imágenes antes de guardar el auto.");
          setLoading(false);
          return;
        }

        if (!uploadedImages.some((image) => image.isCover)) {
          uploadedImages[0].isCover = true;
        }

        const payload = {
          brand: String(form.get("brand") ?? "").trim(),
          model: String(form.get("model") ?? "").trim(),
          version: emptyToNull(form.get("version")),
          year: Number(form.get("year")),
          mileageKm: Number(form.get("mileageKm")),
          priceUsd: Number(form.get("priceUsd")),
          condition: String(form.get("condition")),
          status: String(form.get("status")),
          category: emptyToNull(form.get("category")),
          showWhenSold: form.get("showWhenSold") === "on",
          fuelType: emptyToNull(form.get("fuelType")),
          transmission: emptyToNull(form.get("transmission")),
          engine: emptyToNull(form.get("engine")),
          engineCapacity: emptyToNull(form.get("engineCapacity")),
          powerHp: numberOrNull(form.get("powerHp")),
          tankCapacityL: numberOrNull(form.get("tankCapacityL")),
          doors: numberOrNull(form.get("doors")),
          seats: numberOrNull(form.get("seats")),
          cityKmPerLiter: numberOrNull(form.get("cityKmPerLiter")),
          roadKmPerLiter: numberOrNull(form.get("roadKmPerLiter")),
          safetyNotes: emptyToNull(form.get("safetyNotes")),
          specsSource: emptyToNull(form.get("specsSource")),
          specsReviewed: form.get("specsReviewed") === "on",
          specsReviewNote: emptyToNull(form.get("specsReviewNote")),
          tag: emptyToNull(form.get("tag")),
          description: emptyToNull(form.get("description")),
          images: uploadedImages,
        };

        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 20000);

        let response: Response;
        try {
          response = await fetch(car ? `/api/admin/cars/${car.id}` : "/api/admin/cars", {
            method: car ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });
        } catch {
          setError("El guardado tardó demasiado. Revisá la conexión y probá de nuevo.");
          setLoading(false);
          return;
        } finally {
          window.clearTimeout(timeout);
        }

        setLoading(false);

        const data = await response.json().catch(() => null);
        if (!response.ok) {
          const fieldErrors = data?.issues?.fieldErrors
            ? Object.values(data.issues.fieldErrors).flat().filter(Boolean)
            : [];
          const issue = data?.issues?.formErrors?.[0] ?? fieldErrors[0] ?? data?.error;
          setError(issue ?? "No se pudo guardar el auto.");
          return;
        }

        router.push("/admin/autos");
        router.refresh();
      }}
    >
      {error ? <p className="rounded-2xl bg-red-50 p-4 text-lg font-bold text-red-800">{error}</p> : null}

      <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-black text-zinc-950">Datos principales</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextInput label="Marca" name="brand" defaultValue={car?.brand} placeholder="Ej: Chevrolet, Toyota, Volkswagen" required />
          <TextInput label="Modelo exacto" name="model" defaultValue={car?.model} placeholder="Ej: Onix LTS, Hilux DX 4x4, Gol Trend" required />
          <TextInput label="Versión" name="version" defaultValue={car?.version} placeholder="Ej: 1.0 Turbo LTZ, DX 4x4, Highline" />
          <TextInput label="Año" name="year" type="number" defaultValue={car?.year} placeholder="Ej: 2021" required />
          <TextInput label="Kilometraje" name="mileageKm" type="number" defaultValue={car?.mileageKm} placeholder="Ej: 85000" required />
          <TextInput label="Precio USD" name="priceUsd" type="number" defaultValue={car?.priceUsd} placeholder="Ej: 14900" required />
          <SelectInput label="Estado del uso" name="condition" defaultValue={car?.condition ?? (car?.mileageKm === 0 ? "NUEVO" : "USADO")} options={selectOptions.condition} />
          <SelectInput label="Estado de publicación" name="status" defaultValue={car?.status ?? "BORRADOR"} options={selectOptions.status} />
          <SelectInput label="Categoría" name="category" defaultValue={car?.category} options={selectOptions.category} />
          <SelectInput label="Etiqueta" name="tag" defaultValue={car?.tag} options={selectOptions.tag} />
        </div>
        <label className="mt-5 flex items-center gap-3 text-lg font-black text-zinc-950">
          <input type="checkbox" name="showWhenSold" defaultChecked={car?.showWhenSold ?? false} className="h-5 w-5 accent-[#D32F2F]" />
          Mostrar si queda vendido
        </label>
      </section>

      <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black text-zinc-950">Ficha técnica</h2>
            <p className="mt-2 text-lg text-zinc-700">Buscá datos automáticos y confirmalos manualmente antes de publicar.</p>
          </div>
          <button type="button" onClick={searchSpecs} disabled={searchingSpecs} className="inline-flex min-h-12 items-center justify-center rounded-full bg-zinc-950 px-5 text-base font-black text-white hover:bg-zinc-800 disabled:opacity-60">
            {searchingSpecs ? "Buscando..." : "Buscar ficha técnica"}
          </button>
        </div>
        {specsWarning ? <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-base font-bold text-amber-950">{specsWarning}</p> : null}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <SelectInput label="Combustible" name="fuelType" defaultValue={car?.fuelType} options={selectOptions.fuelType} />
          <SelectInput label="Caja" name="transmission" defaultValue={car?.transmission} options={selectOptions.transmission} />
          <TextInput label="Motor" name="engine" defaultValue={car?.engine} placeholder="Ej: 1.0 Turbo, 1.6 nafta, 2.4 turbodiésel" />
          <TextInput label="Cilindrada" name="engineCapacity" defaultValue={car?.engineCapacity} placeholder="Ej: 1.0 L, 1.6 L, 2.4 L" />
          <TextInput label="Potencia HP" name="powerHp" type="number" defaultValue={car?.powerHp} placeholder="Ej: 116" />
          <TextInput label="Tanque litros" name="tankCapacityL" type="number" defaultValue={car?.tankCapacityL} placeholder="Ej: 44" />
          <TextInput label="Puertas" name="doors" type="number" defaultValue={car?.doors} placeholder="Ej: 5" />
          <TextInput label="Plazas" name="seats" type="number" defaultValue={car?.seats} placeholder="Ej: 5" />
          <TextInput label="Consumo ciudad km/l" name="cityKmPerLiter" type="number" step="0.1" defaultValue={car?.cityKmPerLiter} placeholder="Ej: 10.5" />
          <TextInput label="Consumo ruta km/l" name="roadKmPerLiter" type="number" step="0.1" defaultValue={car?.roadKmPerLiter} placeholder="Ej: 14.8" />
          <SelectInput label="Fuente ficha" name="specsSource" defaultValue={car?.specsSource ?? "MANUAL"} options={selectOptions.specsSource} />
        </div>
        <label className="mt-5 flex items-center gap-3 text-lg font-black text-zinc-950">
          <input type="checkbox" name="specsReviewed" defaultChecked={car?.specsReviewed ?? true} className="h-5 w-5 accent-[#D32F2F]" />
          Ficha técnica revisada por el dueño
        </label>
        <label className="mt-5 grid gap-2 text-base font-black text-zinc-950">
          Notas de seguridad o revisión
          <textarea name="safetyNotes" defaultValue={car?.safetyNotes ?? ""} rows={3} placeholder="Ej: Datos estimados, verificar contra manual o ficha oficial antes de publicar." className="rounded-2xl border border-zinc-300 px-4 py-3 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100" />
        </label>
        <label className="mt-5 grid gap-2 text-base font-black text-zinc-950">
          Advertencia interna de revisión
          <textarea name="specsReviewNote" defaultValue={car?.specsReviewNote ?? ""} rows={3} placeholder="Ej: Revisar consumo y potencia antes de marcar como revisada." className="rounded-2xl border border-zinc-300 px-4 py-3 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100" />
        </label>
      </section>

      <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black text-zinc-950">Imágenes</h2>
            <p className="mt-2 text-lg text-zinc-700">Mínimo 3, máximo 8. Recomendado: 5.</p>
          </div>
          <button
            type="button"
            disabled={images.length >= 8}
            onClick={() => setImages((current) => [...current, makeEmptyImage(current.length)])}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 text-base font-black text-white disabled:opacity-50"
          >
            <Plus aria-hidden="true" size={20} />
            Agregar imagen
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          {images.map((image, index) => (
            <div key={`${image.url}-${index}`} className="rounded-3xl bg-zinc-50 p-4">
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
                <label className="grid gap-2 text-base font-black text-zinc-950">
                  URL imagen {index + 1}
                  <input value={image.url.startsWith("blob:") ? "Subiendo archivo..." : image.url} onChange={(event) => updateImage(index, { url: event.target.value })} placeholder="Subí archivo o pegá una URL https://..." className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100" />
                </label>
                <label className="grid gap-2 text-base font-black text-zinc-950">
                  Texto alternativo
                  <input value={image.alt} onChange={(event) => updateImage(index, { alt: event.target.value })} placeholder="Ej: Toyota Hilux DX 4x4 vista exterior" className="min-h-12 rounded-2xl border border-zinc-300 px-4 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100" />
                </label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => moveImage(index, -1)} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-zinc-200"><ArrowUp size={20} /></button>
                  <button type="button" onClick={() => moveImage(index, 1)} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-zinc-200"><ArrowDown size={20} /></button>
                  <button type="button" disabled={images.length <= 3} onClick={() => removeImage(index)} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-700 ring-1 ring-zinc-200 disabled:opacity-50"><Trash2 size={20} /></button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-base font-black text-zinc-950">
                  <input type="radio" name="cover" checked={image.isCover} onChange={() => setCover(index)} className="h-5 w-5 accent-[#D32F2F]" />
                  Portada
                </label>
                <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 text-base font-black text-zinc-950 ring-1 ring-zinc-200 hover:bg-zinc-100">
                  <ImageUp aria-hidden="true" size={18} />
                  {uploadingIndex === index ? "Subiendo..." : "Subir archivo"}
                  <input
                    type="file"
                    accept="image/*,.heic,.heif"
                    className="sr-only"
                    disabled={uploadingIndex !== null}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadImage(index, file);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
                {image.url ? <span className="text-sm font-bold text-green-700">{image.url.startsWith("blob:") ? "Subiendo imagen..." : "Imagen cargada"}</span> : null}
                {imageErrors[index] ? <span className="text-sm font-bold text-red-700">{imageErrors[index]}</span> : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
        <label className="grid gap-2 text-base font-black text-zinc-950">
          Descripción pública
          <textarea name="description" defaultValue={car?.description ?? ""} rows={5} placeholder="Ej: Muy buen estado general, service al día, único dueño, acepta permuta." className="rounded-2xl border border-zinc-300 px-4 py-3 text-lg font-semibold outline-none focus:border-[#D32F2F] focus:ring-4 focus:ring-red-100" />
        </label>
      </section>

      <div className="sticky bottom-4 z-20 rounded-[2rem] bg-zinc-950 p-4 shadow-2xl shadow-zinc-950/25">
        <button type="submit" disabled={loading} className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#D32F2F] px-6 text-lg font-black text-white hover:bg-[#b92727] disabled:opacity-60 sm:w-auto">
          <Save aria-hidden="true" size={22} />
          {loading ? "Guardando..." : "Guardar auto"}
        </button>
      </div>
    </form>
  );
}
