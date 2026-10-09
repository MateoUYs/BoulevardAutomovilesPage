import "server-only";

export type VehicleSpecsResult = {
  source: "NHTSA" | "FUELECONOMY" | "AI_ESTIMADO" | "MANUAL";
  engine?: string | null;
  engineCapacity?: string | null;
  powerHp?: number | null;
  transmission?: "MANUAL" | "AUTOMATICA" | "CVT" | "OTRA" | null;
  fuelType?: "NAFTA" | "DIESEL" | "HIBRIDO" | "ELECTRICO" | "FLEX" | "OTRO" | null;
  tankCapacityL?: number | null;
  doors?: number | null;
  seats?: number | null;
  cityKmPerLiter?: number | null;
  roadKmPerLiter?: number | null;
  safetyNotes?: string | null;
  confidence: "high" | "medium" | "low";
  warning?: string;
};

type VehicleSpecsInput = {
  brand: string;
  model: string;
  year: number;
  category?: string | null;
};

type FuelEconomyMenu = {
  menuItem?: { text: string; value: string } | Array<{ text: string; value: string }>;
};

const mpgToKmPerLiter = (mpg?: number | string | null) => {
  const value = Number(mpg);
  if (!value || Number.isNaN(value)) return null;
  return Math.round(value * 0.425144 * 10) / 10;
};

function normalizeFuel(value?: string | null): VehicleSpecsResult["fuelType"] {
  const lower = value?.toLowerCase() ?? "";
  if (lower.includes("diesel") || lower.includes("gasoil")) return "DIESEL";
  if (lower.includes("electric") || lower.includes("electrico") || lower.includes("eléctrico")) return "ELECTRICO";
  if (lower.includes("hybrid") || lower.includes("hibrido") || lower.includes("híbrido")) return "HIBRIDO";
  if (lower.includes("flex")) return "FLEX";
  if (lower.includes("regular") || lower.includes("premium") || lower.includes("gasoline") || lower.includes("nafta")) return "NAFTA";
  return value ? "OTRO" : null;
}

function normalizeTransmission(value?: string | null): VehicleSpecsResult["transmission"] {
  const lower = value?.toLowerCase() ?? "";
  if (lower.includes("manual")) return "MANUAL";
  if (lower.includes("cvt")) return "CVT";
  if (lower.includes("auto")) return "AUTOMATICA";
  return value ? "OTRA" : null;
}

function cleanModelForPublicApis(model: string) {
  return model
    .toLowerCase()
    .replace(/\b(l|ls|lt|lts|ltz|premier|joy|advance|sense|active|allure|feline|xli|gli|se|sel|trend|comfortline|highline|full)\b/g, " ")
    .replace(/\b\d\.\d\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function asSafeNumber(value: unknown, min: number, max: number) {
  const number = Number(typeof value === "string" ? value.replace(",", ".") : value);
  if (!Number.isFinite(number) || number < min || number > max) return null;
  return Math.round(number * 10) / 10;
}

function asSafeInteger(value: unknown, min: number, max: number) {
  const number = Number(typeof value === "string" ? value.replace(",", ".") : value);
  const rounded = Math.round(number);
  if (!Number.isFinite(number) || rounded < min || rounded > max) return null;
  return rounded;
}

function asShortText(value: unknown, maxLength = 140) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text ? text.slice(0, maxLength) : null;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "BoulevardAutomoviles/1.0" },
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    if (!response.ok) return null;
    return response.json() as Promise<T>;
  } catch {
    return null;
  }
}

function asArray<T>(value: T | T[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeVehicleInput(input: VehicleSpecsInput) {
  const combined = `${input.brand} ${input.model}`.toLowerCase();
  const makes = ["toyota", "chevrolet", "peugeot", "renault", "volkswagen", "fiat", "ford", "hyundai", "kia", "nissan", "citroen", "citroën", "honda", "suzuki", "chery", "byd", "jac", "geely", "jeep", "audi", "bmw", "mercedes", "mercedes-benz", "mitsubishi", "mazda", "subaru", "ram", "great wall", "haval"];
  const make = makes.find((item) => combined.includes(item)) ?? input.brand.trim().split(/\s+/)[0]?.toLowerCase() ?? input.brand.toLowerCase();
  const modelText = cleanModelForPublicApis(combined.replace(new RegExp(`\\b${make}\\b`, "g"), " ").replace(/\b(19|20)\d{2}\b/g, " "));

  return { make, modelText, year: input.year };
}

async function getAiEstimatedSpecs(input: VehicleSpecsInput): Promise<VehicleSpecsResult | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const prompt = `Necesito una ficha tecnica aproximada para una automotora de Uruguay. Vehiculo: ${input.brand} ${input.model}, año ${input.year}, categoria ${input.category ?? "no especificada"}. Usa conocimiento general de modelos vendidos en Uruguay/LatAm. Si un dato no es razonablemente confiable, devuelve null. Devuelve solo JSON con estas claves: engine, engineCapacity, powerHp, transmission, fuelType, tankCapacityL, doors, seats, cityKmPerLiter, roadKmPerLiter, safetyNotes. transmission debe ser MANUAL, AUTOMATICA, CVT, OTRA o null. fuelType debe ser NAFTA, DIESEL, HIBRIDO, ELECTRICO, FLEX, OTRO o null. Consumos en km/l, conservadores y realistas. No inventes datos exactos si no hay confianza.`;
  const models = ["gpt-4o-mini", "gpt-4.1-mini", "gpt-4o"];

  for (const model of models) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Respondé solamente JSON válido. No agregues markdown." },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!response.ok) continue;

    try {
      const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const content = data.choices?.[0]?.message?.content?.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
      if (!content) continue;

      const parsed = JSON.parse(content) as Record<string, unknown>;
      const transmission = normalizeTransmission(asShortText(parsed.transmission));
      const fuelType = normalizeFuel(asShortText(parsed.fuelType));

      return {
        source: "AI_ESTIMADO",
        engine: asShortText(parsed.engine, 120),
        engineCapacity: asShortText(parsed.engineCapacity, 80),
        powerHp: asSafeInteger(parsed.powerHp, 35, 700),
        transmission,
        fuelType,
        tankCapacityL: asSafeInteger(parsed.tankCapacityL, 15, 180),
        doors: asSafeInteger(parsed.doors, 2, 6),
        seats: asSafeInteger(parsed.seats, 2, 12),
        cityKmPerLiter: asSafeNumber(parsed.cityKmPerLiter, 2, 35),
        roadKmPerLiter: asSafeNumber(parsed.roadKmPerLiter, 3, 40),
        safetyNotes: asShortText(parsed.safetyNotes, 500) ?? "Ficha estimada automáticamente para modelos regionales. Revisar contra manual, libreta o fuente oficial antes de publicar.",
        confidence: "low",
        warning: "Ficha estimada con IA porque las bases públicas no encontraron una coincidencia confiable. Revisá consumo, motor, potencia y caja antes de marcarla como revisada.",
      };
    } catch {
      continue;
    }
  }

  return null;
}

function getConservativeLocalEstimate(input: VehicleSpecsInput, existsInNhtsa: boolean): VehicleSpecsResult | null {
  const text = `${input.brand} ${input.model}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const baseWarning = existsInNhtsa
    ? "NHTSA encontró una coincidencia de marca/modelo/año, pero sin ficha completa. Se cargó una referencia conservadora para revisar manualmente."
    : "No hubo ficha completa en las bases públicas ni respuesta utilizable de IA. Se cargó una referencia conservadora para revisar manualmente.";

  if (text.includes("hilux")) {
    return {
      source: "AI_ESTIMADO",
      engine: "2.4 turbodiésel estimado según versión",
      engineCapacity: "2.4 L",
      powerHp: 150,
      transmission: text.includes("auto") ? "AUTOMATICA" : "MANUAL",
      fuelType: "DIESEL",
      tankCapacityL: 80,
      doors: 4,
      seats: 5,
      cityKmPerLiter: 8.5,
      roadKmPerLiter: 11.5,
      safetyNotes: "Referencia conservadora para Toyota Hilux regional. Verificar contra libreta, manual o ficha oficial de la unidad.",
      confidence: "low",
      warning: `${baseWarning} Revisá especialmente motor, caja, potencia y consumo antes de publicar.`,
    };
  }

  if (text.includes("onix")) {
    return {
      source: "AI_ESTIMADO",
      engine: "Nafta estimado según versión",
      engineCapacity: input.year >= 2020 ? "1.0/1.2 L" : "1.4 L",
      powerHp: null,
      transmission: text.includes("auto") || text.includes("at") ? "AUTOMATICA" : "MANUAL",
      fuelType: "NAFTA",
      tankCapacityL: 44,
      doors: 5,
      seats: 5,
      cityKmPerLiter: 11.5,
      roadKmPerLiter: 15.5,
      safetyNotes: "Referencia conservadora para Chevrolet Onix regional. La motorización puede variar por año y versión.",
      confidence: "low",
      warning: `${baseWarning} Revisá especialmente cilindrada, potencia y consumo antes de publicar.`,
    };
  }

  if (text.includes("cruze")) {
    return {
      source: "AI_ESTIMADO",
      engine: "1.4 turbo nafta estimado",
      engineCapacity: "1.4 L",
      powerHp: 153,
      transmission: text.includes("manual") ? "MANUAL" : "AUTOMATICA",
      fuelType: "NAFTA",
      tankCapacityL: 52,
      doors: 4,
      seats: 5,
      cityKmPerLiter: 10,
      roadKmPerLiter: 15,
      safetyNotes: "Referencia conservadora para Chevrolet Cruze regional. Verificar contra ficha oficial de la unidad.",
      confidence: "low",
      warning: `${baseWarning} Revisá los datos antes de publicar.`,
    };
  }

  const category = input.category;
  if (!category) return null;

  const byCategory: Record<string, Pick<VehicleSpecsResult, "cityKmPerLiter" | "roadKmPerLiter" | "doors" | "seats" | "fuelType">> = {
    SEDAN: { cityKmPerLiter: 10.5, roadKmPerLiter: 15, doors: 4, seats: 5, fuelType: "NAFTA" },
    HATCHBACK: { cityKmPerLiter: 12, roadKmPerLiter: 16, doors: 5, seats: 5, fuelType: "NAFTA" },
    SUV: { cityKmPerLiter: 8.5, roadKmPerLiter: 12.5, doors: 5, seats: 5, fuelType: "NAFTA" },
    PICKUP: { cityKmPerLiter: 8, roadKmPerLiter: 11.5, doors: 4, seats: 5, fuelType: "DIESEL" },
    UTILITARIO: { cityKmPerLiter: 9, roadKmPerLiter: 13, doors: 4, seats: 2, fuelType: "DIESEL" },
    OTRO: { cityKmPerLiter: 10, roadKmPerLiter: 14, doors: null, seats: null, fuelType: null },
  };
  const estimate = byCategory[category];
  if (!estimate) return null;

  return {
    source: "AI_ESTIMADO",
    ...estimate,
    engine: null,
    engineCapacity: null,
    powerHp: null,
    tankCapacityL: null,
    transmission: null,
    safetyNotes: "Referencia genérica por categoría. Úsala solo como punto de partida y verificá la ficha real del vehículo.",
    confidence: "low",
    warning: `${baseWarning} Solo se completaron referencias generales por categoría; verificá la ficha antes de publicar.`,
  };
}

async function getFuelEconomySpecs(brand: string, model: string, year: number): Promise<VehicleSpecsResult | null> {
  const makeUrl = `https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=${year}&make=${encodeURIComponent(brand)}`;
  const models = await fetchJson<FuelEconomyMenu>(makeUrl);
  const matchedModel = asArray(models?.menuItem).find((item) => item.text.toLowerCase().includes(model.toLowerCase()) || model.toLowerCase().includes(item.text.toLowerCase()));
  if (!matchedModel) return null;

  const optionsUrl = `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${encodeURIComponent(brand)}&model=${encodeURIComponent(matchedModel.text)}`;
  const options = await fetchJson<FuelEconomyMenu>(optionsUrl);
  const option = asArray(options?.menuItem)[0];
  if (!option) return null;

  const vehicle = await fetchJson<Record<string, string>>(`https://www.fueleconomy.gov/ws/rest/vehicle/${option.value}`);
  if (!vehicle) return null;

  return {
    source: "FUELECONOMY",
    engine: vehicle.displ ? `${vehicle.displ} L` : null,
    engineCapacity: vehicle.displ ? `${vehicle.displ} L` : null,
    transmission: normalizeTransmission(vehicle.trany),
    fuelType: normalizeFuel(vehicle.fuelType),
    cityKmPerLiter: mpgToKmPerLiter(vehicle.city08),
    roadKmPerLiter: mpgToKmPerLiter(vehicle.highway08),
    safetyNotes: "Consumo obtenido desde fueleconomy.gov cuando el modelo existe en el mercado estadounidense.",
    confidence: "medium",
  };
}

async function getNhtsaModelExists(brand: string, model: string, year: number) {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(brand)}/modelyear/${year}?format=json`;
  const data = await fetchJson<{ Results?: Array<{ Model_Name?: string }> }>(url);
  return Boolean(data?.Results?.some((item) => item.Model_Name?.toLowerCase().includes(model.toLowerCase())));
}

export async function findVehicleSpecs(input: VehicleSpecsInput): Promise<VehicleSpecsResult> {
  const normalized = normalizeVehicleInput(input);
  const fuelEconomy = await getFuelEconomySpecs(normalized.make, normalized.modelText, input.year);
  if (fuelEconomy) return fuelEconomy;

  const existsInNhtsa = await getNhtsaModelExists(normalized.make, normalized.modelText, input.year);

  const aiEstimate = await getAiEstimatedSpecs(input);
  if (aiEstimate) return aiEstimate;

  const localEstimate = getConservativeLocalEstimate(input, existsInNhtsa);
  if (localEstimate) return localEstimate;

  if (existsInNhtsa) {
    return {
      source: "NHTSA",
      confidence: "low",
      safetyNotes: "NHTSA confirmó que existe marca/modelo/año, pero no provee una ficha técnica completa para completar automáticamente.",
      warning: "Se encontró una coincidencia posible en NHTSA, pero no hay ficha técnica completa confiable. Cargá y verificá los datos manualmente.",
    };
  }

  return {
    source: "MANUAL",
    confidence: "low",
    warning: "No se encontró una ficha técnica confiable para completar automáticamente. Cargá la ficha manualmente.",
  };
}
