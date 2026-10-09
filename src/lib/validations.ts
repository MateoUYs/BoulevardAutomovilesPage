import { z } from "zod";

export const carImageInputSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(3).max(180),
  order: z.number().int().min(0),
  isCover: z.boolean().default(false),
});

export const carInputSchema = z.object({
  brand: z.string().min(2).max(80),
  model: z.string().min(1).max(100),
  version: z.string().max(120).optional().nullable(),
  year: z.number().int().min(1950).max(new Date().getFullYear() + 1),
  mileageKm: z.number().int().min(0).max(2_000_000),
  priceUsd: z.number().int().min(0).max(1_000_000),
  images: z.array(carImageInputSchema).min(3).max(8),
});

export const inquiryInputSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(6).max(30),
  email: z.email().optional().or(z.literal("")),
  message: z.string().min(5).max(1000),
  honeypot: z.string().max(0).optional(),
});

export const fuelPriceInputSchema = z.object({
  gasolinePriceUyu: z.number().positive(),
  dieselPriceUyu: z.number().positive(),
  electricKwhUyu: z.number().positive().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export const siteSettingsInputSchema = z.object({
  showSoldVehicles: z.boolean(),
  whatsappPhoneIntl: z.string().min(8).max(20),
  primaryPhone: z.string().min(6).max(30),
  secondaryPhone: z.string().min(6).max(30),
  instagramUrl: z.url(),
  businessHours: z.string().max(300).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
});

export const consumptionReferenceInputSchema = z.object({
  references: z.array(z.object({
    category: z.enum(["SEDAN", "HATCHBACK", "SUV", "PICKUP", "UTILITARIO", "OTRO"]),
    cityKmPerLiterAvg: z.number().positive().max(100),
    roadKmPerLiterAvg: z.number().positive().max(100),
    notes: z.string().max(500).optional().nullable(),
  })).min(1),
});

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isNaN(number) ? value : number;
}, z.number().nullable());

const requiredNumber = z.preprocess((value) => {
  const number = Number(value);
  return Number.isNaN(number) ? value : number;
}, z.number());

export const adminCarImageSchema = z.object({
  url: z.string().min(1, "La imagen necesita una URL."),
  alt: z.string().min(3, "El texto alternativo es obligatorio.").max(180),
  order: z.number().int().min(0),
  isCover: z.boolean(),
});

export const adminCarSchema = z.object({
  brand: z.string().min(2, "La marca es obligatoria.").max(80),
  model: z.string().min(1, "El modelo es obligatorio.").max(100),
  version: z.string().max(120).nullable(),
  year: requiredNumber.pipe(z.number().int().min(1950).max(new Date().getFullYear() + 1)),
  mileageKm: requiredNumber.pipe(z.number().int().min(0).max(2_000_000)),
  priceUsd: requiredNumber.pipe(z.number().int().min(0).max(1_000_000)),
  condition: z.enum(["NUEVO", "USADO"]),
  status: z.enum(["BORRADOR", "PUBLICADO", "RESERVADO", "VENDIDO"]),
  category: z.enum(["SEDAN", "HATCHBACK", "SUV", "PICKUP", "UTILITARIO", "OTRO"]).nullable(),
  showWhenSold: z.boolean(),
  fuelType: z.enum(["NAFTA", "DIESEL", "HIBRIDO", "ELECTRICO", "FLEX", "OTRO"]).nullable(),
  transmission: z.enum(["MANUAL", "AUTOMATICA", "CVT", "OTRA"]).nullable(),
  engine: z.string().max(120).nullable(),
  engineCapacity: z.string().max(80).nullable(),
  powerHp: optionalNumber.pipe(z.number().int().min(0).max(2000).nullable()),
  tankCapacityL: optionalNumber.pipe(z.number().int().min(0).max(300).nullable()),
  doors: optionalNumber.pipe(z.number().int().min(0).max(10).nullable()),
  seats: optionalNumber.pipe(z.number().int().min(0).max(80).nullable()),
  cityKmPerLiter: optionalNumber.pipe(z.number().min(0).max(100).nullable()),
  roadKmPerLiter: optionalNumber.pipe(z.number().min(0).max(100).nullable()),
  safetyNotes: z.string().max(1000).nullable(),
  specsSource: z.enum(["NHTSA", "FUELECONOMY", "CARQUERY", "AI_ESTIMADO", "MANUAL"]).nullable(),
  specsReviewed: z.boolean(),
  specsReviewNote: z.string().max(1000).nullable(),
  tag: z.enum(["CERO_KM", "RECIEN_INGRESADO", "OPORTUNIDAD", "FINANCIABLE"]).nullable(),
  description: z.string().max(2000).nullable(),
  images: z.array(adminCarImageSchema).min(3, "Cargá al menos 3 imágenes.").max(8, "Cargá como máximo 8 imágenes."),
}).superRefine((data, ctx) => {
  const covers = data.images.filter((image) => image.isCover);
  if (covers.length !== 1) {
    ctx.addIssue({ code: "custom", message: "Debe haber exactamente una imagen de portada.", path: ["images"] });
  }
  if (data.status !== "BORRADOR" && !data.specsReviewed) {
    ctx.addIssue({ code: "custom", message: "La ficha técnica debe estar revisada antes de publicar, reservar o vender.", path: ["specsReviewed"] });
  }
});
