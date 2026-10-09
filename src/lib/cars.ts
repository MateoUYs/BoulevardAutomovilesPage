import { prisma } from "@/lib/prisma";
import { demoFuelPriceConfig } from "@/lib/demo-cars";
import type { CatalogFilters, CatalogResult, FuelPriceConfig, FuelType, PublicCar } from "@/lib/car-types";
import type { Prisma } from "@prisma/client";

const pageSize = 6;
const publicCacheTtlMs = 30_000;

const publicCache = new Map<string, { expiresAt: number; value: unknown }>();

function getCached<T>(key: string) {
  const cached = publicCache.get(key);
  if (!cached || cached.expiresAt < Date.now()) {
    publicCache.delete(key);
    return null;
  }
  return cached.value as T;
}

function setCached<T>(key: string, value: T) {
  publicCache.set(key, { expiresAt: Date.now() + publicCacheTtlMs, value });
  return value;
}

const catalogCarInclude = {
  images: {
    orderBy: [{ isCover: "desc" }, { order: "asc" }],
    take: 1,
  },
} satisfies Prisma.CarInclude;

const demoConsumptionReferences = [
  { category: "SEDAN", cityKmPerLiterAvg: 10.5, roadKmPerLiterAvg: 15.2 },
  { category: "HATCHBACK", cityKmPerLiterAvg: 12, roadKmPerLiterAvg: 17 },
  { category: "SUV", cityKmPerLiterAvg: 8.8, roadKmPerLiterAvg: 13.2 },
  { category: "PICKUP", cityKmPerLiterAvg: 8.2, roadKmPerLiterAvg: 12.1 },
  { category: "UTILITARIO", cityKmPerLiterAvg: 9.4, roadKmPerLiterAvg: 13.8 },
  { category: "OTRO", cityKmPerLiterAvg: 10, roadKmPerLiterAvg: 14 },
] as const;

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), ms);
    }),
  ]);
}

function coverFirst(car: PublicCar) {
  return {
    ...car,
    images: [...car.images].sort((a, b) => Number(b.isCover) - Number(a.isCover) || a.order - b.order),
  };
}

function normalizeText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function filterCars(cars: PublicCar[], filters: CatalogFilters, showSoldVehicles: boolean) {
  const minPrice = Number(filters.minPrice || 0);
  const maxPrice = Number(filters.maxPrice || 0);
  const q = normalizeText(filters.q ?? "");

  return cars.filter((car) => {
    if (car.status === "BORRADOR") return false;
    if (car.status === "VENDIDO" && !showSoldVehicles) return false;
    if (filters.brand && car.brand !== filters.brand) return false;
    if (filters.year && car.year !== Number(filters.year)) return false;
    if (filters.fuel && car.fuelType !== filters.fuel) return false;
    if (minPrice && car.priceUsd < minPrice) return false;
    if (maxPrice && car.priceUsd > maxPrice) return false;
    if (q) {
      const haystack = normalizeText(`${car.brand} ${car.model} ${car.version ?? ""} ${car.year}`);
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function sortCars(cars: PublicCar[], sort = "recent") {
  return [...cars].sort((a, b) => {
    if (sort === "price-asc") return a.priceUsd - b.priceUsd;
    if (sort === "price-desc") return b.priceUsd - a.priceUsd;
    return (b.publishedAt?.getTime() ?? b.createdAt.getTime()) - (a.publishedAt?.getTime() ?? a.createdAt.getTime());
  });
}

function getCatalogOrderBy(sort = "recent"): Prisma.CarOrderByWithRelationInput[] {
  if (sort === "price-asc") return [{ priceUsd: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }];
  if (sort === "price-desc") return [{ priceUsd: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }];
  return [{ publishedAt: "desc" }, { createdAt: "desc" }];
}

function toPositiveInt(value?: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function buildCatalogWhere(filters: CatalogFilters, showSoldVehicles: boolean): Prisma.CarWhereInput {
  const year = toPositiveInt(filters.year);
  const minPrice = toPositiveInt(filters.minPrice);
  const maxPrice = toPositiveInt(filters.maxPrice);
  const q = filters.q?.trim();

  return {
    OR: showSoldVehicles
      ? [{ status: { in: ["PUBLICADO", "RESERVADO", "VENDIDO"] as Prisma.EnumPublishStatusFilter["in"] } }]
      : [
          { status: { in: ["PUBLICADO", "RESERVADO"] as Prisma.EnumPublishStatusFilter["in"] } },
          { status: "VENDIDO", showWhenSold: true },
        ],
    ...(filters.brand ? { brand: filters.brand } : {}),
    ...(year ? { year } : {}),
    ...(filters.fuel ? { fuelType: filters.fuel as FuelType } : {}),
    ...(minPrice || maxPrice
      ? {
          priceUsd: {
            ...(minPrice ? { gte: minPrice } : {}),
            ...(maxPrice ? { lte: maxPrice } : {}),
          },
        }
      : {}),
    ...(q
      ? {
          OR: [
            { brand: { contains: q, mode: "insensitive" } },
            { model: { contains: q, mode: "insensitive" } },
            { version: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}

function buildCatalogResult(cars: PublicCar[], filters: CatalogFilters, showSoldVehicles: boolean): CatalogResult {
  const available = cars.filter((car) => car.status !== "BORRADOR" && (showSoldVehicles || car.status !== "VENDIDO"));
  const filtered = sortCars(filterCars(cars, filters, showSoldVehicles), filters.sort);
  const page = Math.max(1, Number(filters.page || 1));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    cars: filtered.slice(start, start + pageSize).map(coverFirst),
    total: filtered.length,
    page: safePage,
    pageSize,
    totalPages,
    brands: [...new Set(available.map((car) => car.brand))].sort(),
    years: [...new Set(available.map((car) => car.year))].sort((a, b) => b - a),
    fuels: [...new Set(available.map((car) => car.fuelType).filter(Boolean))] as FuelType[],
  };
}

async function getShowSoldVehicles() {
  const cached = getCached<boolean>("settings:showSoldVehicles");
  if (cached !== null) return cached;

  const setting = await withTimeout(prisma.siteSetting.findFirst({ orderBy: { updatedAt: "desc" } }), 1500);
  return setCached("settings:showSoldVehicles", setting?.showSoldVehicles ?? false);
}

export async function getCatalogCars(filters: CatalogFilters): Promise<CatalogResult> {
  try {
    const cacheKey = `catalog:${JSON.stringify(filters)}`;
    const cached = getCached<CatalogResult>(cacheKey);
    if (cached) return cached;

    const showSoldVehicles = await getShowSoldVehicles();
    const where = buildCatalogWhere(filters, showSoldVehicles);
    const availableWhere: Prisma.CarWhereInput = {
      OR: showSoldVehicles
        ? [{ status: { in: ["PUBLICADO", "RESERVADO", "VENDIDO"] as Prisma.EnumPublishStatusFilter["in"] } }]
        : [
            { status: { in: ["PUBLICADO", "RESERVADO"] as Prisma.EnumPublishStatusFilter["in"] } },
            { status: "VENDIDO", showWhenSold: true },
          ],
    };
    const page = Math.max(1, Number(filters.page || 1));

    const [total, cars, available] = await prisma.$transaction([
      prisma.car.count({ where }),
      prisma.car.findMany({
        where,
        include: catalogCarInclude,
        orderBy: getCatalogOrderBy(filters.sort),
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.car.findMany({
        where: availableWhere,
        select: { brand: true, year: true, fuelType: true },
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);

    if (safePage !== page && total > 0) {
      const safeCars = await prisma.car.findMany({
        where,
        include: catalogCarInclude,
        orderBy: getCatalogOrderBy(filters.sort),
        skip: (safePage - 1) * pageSize,
        take: pageSize,
      });

      return setCached(cacheKey, {
        cars: (safeCars as PublicCar[]).map(coverFirst),
        total,
        page: safePage,
        pageSize,
        totalPages,
        brands: [...new Set(available.map((car) => car.brand))].sort(),
        years: [...new Set(available.map((car) => car.year))].sort((a, b) => b - a),
        fuels: [...new Set(available.map((car) => car.fuelType).filter(Boolean))] as FuelType[],
      });
    }

    return setCached(cacheKey, {
      cars: (cars as PublicCar[]).map(coverFirst),
      total,
      page: safePage,
      pageSize,
      totalPages,
      brands: [...new Set(available.map((car) => car.brand))].sort(),
      years: [...new Set(available.map((car) => car.year))].sort((a, b) => b - a),
      fuels: [...new Set(available.map((car) => car.fuelType).filter(Boolean))] as FuelType[],
    });
  } catch {
    return buildCatalogResult([], filters, false);
  }
}

export async function getFeaturedCars(limit = 3) {
  try {
    const cacheKey = `featured:${limit}`;
    const cached = getCached<PublicCar[]>(cacheKey);
    if (cached) return cached;

    const showSoldVehicles = await getShowSoldVehicles();
    const cars = await prisma.car.findMany({
      where: {
        OR: showSoldVehicles
          ? [{ status: { in: ["PUBLICADO", "RESERVADO", "VENDIDO"] as Prisma.EnumPublishStatusFilter["in"] } }]
          : [
              { status: { in: ["PUBLICADO", "RESERVADO"] as Prisma.EnumPublishStatusFilter["in"] } },
              { status: "VENDIDO", showWhenSold: true },
            ],
      },
      include: catalogCarInclude,
      orderBy: getCatalogOrderBy("recent"),
      take: limit,
    });

    return setCached(cacheKey, (cars as PublicCar[]).map(coverFirst));
  } catch {
    return [];
  }
}

export async function getCarsBySlugs(slugs: string[]) {
  const cleanSlugs = [...new Set(slugs)].slice(0, 3);
  if (!cleanSlugs.length) return [];

  try {
    const showSoldVehicles = await getShowSoldVehicles();
    const cars = await prisma.car.findMany({
      where: {
        slug: { in: cleanSlugs },
        OR: showSoldVehicles
          ? [{ status: { in: ["PUBLICADO", "RESERVADO", "VENDIDO"] } }]
          : [
              { status: { in: ["PUBLICADO", "RESERVADO"] } },
              { status: "VENDIDO", showWhenSold: true },
            ],
      },
      include: { images: { orderBy: { order: "asc" } } },
    });
    const bySlug = new Map((cars as PublicCar[]).map((car) => [car.slug, coverFirst(car)]));
    return cleanSlugs.map((slug) => bySlug.get(slug)).filter(Boolean) as PublicCar[];
  } catch {
    return [];
  }
}

export async function getCarBySlug(slug: string) {
  try {
    const showSoldVehicles = await getShowSoldVehicles();
    const car = await withTimeout(
      prisma.car.findFirst({
        where: {
          slug,
          OR: showSoldVehicles
            ? [{ status: { in: ["PUBLICADO", "RESERVADO", "VENDIDO"] } }]
            : [
                { status: { in: ["PUBLICADO", "RESERVADO"] } },
                { status: "VENDIDO", showWhenSold: true },
              ],
        },
        include: { images: { orderBy: [{ isCover: "desc" }, { order: "asc" }] } },
      }),
      5000,
    );

    return car ? coverFirst(car as PublicCar) : null;
  } catch {
    return null;
  }
}

export async function getPublicCarSlugs() {
  try {
    const showSoldVehicles = await getShowSoldVehicles();
    const cars = await prisma.car.findMany({
      where: {
        OR: showSoldVehicles
          ? [{ status: { in: ["PUBLICADO", "RESERVADO", "VENDIDO"] } }]
          : [
              { status: { in: ["PUBLICADO", "RESERVADO"] } },
              { status: "VENDIDO", showWhenSold: true },
            ],
      },
      select: { slug: true },
    });
    return cars.map((car) => car.slug);
  } catch {
    return [];
  }
}

export async function getFuelPriceConfig(): Promise<FuelPriceConfig> {
  try {
    const setting = await prisma.fuelPriceSetting.findFirst({ orderBy: { updatedAt: "desc" } });
    return setting ?? demoFuelPriceConfig;
  } catch {
    return demoFuelPriceConfig;
  }
}

export async function getConsumptionReference(category: PublicCar["category"]) {
  if (!category) return null;
  try {
    const reference = await withTimeout(prisma.consumptionReference.findUnique({ where: { category } }), 1200);
    return reference;
  } catch {
    return demoConsumptionReferences.find((reference) => reference.category === category) ?? null;
  }
}

export function getCarDisplayName(car: PublicCar) {
  return `${car.brand} ${car.model} ${car.year}`;
}

export function getCoverImage(car: PublicCar) {
  return car.images.find((image) => image.isCover) ?? car.images[0];
}

export function getCarPublicUrl(car: PublicCar) {
  return `/autos/${car.slug}`;
}

export function getAbsoluteCarUrl(car: PublicCar, siteUrl: string) {
  return `${siteUrl.replace(/\/$/, "")}${getCarPublicUrl(car)}`;
}

export function getFuelLabel(fuel: FuelType | null) {
  const labels: Record<FuelType, string> = {
    NAFTA: "Nafta",
    DIESEL: "Diesel",
    HIBRIDO: "Híbrido",
    ELECTRICO: "Eléctrico",
    FLEX: "Flex",
    OTRO: "Otro",
  };
  return fuel ? labels[fuel] : "No disponible";
}

export function getTransmissionLabel(value: PublicCar["transmission"]) {
  if (!value) return "No disponible";
  const labels = { MANUAL: "Manual", AUTOMATICA: "Automática", CVT: "CVT", OTRA: "Otra" };
  return labels[value];
}

export function getCategoryLabel(value: PublicCar["category"]) {
  if (!value) return "Sin categoría";
  const labels = { SEDAN: "Sedán", HATCHBACK: "Hatchback", SUV: "SUV", PICKUP: "Pickup", UTILITARIO: "Utilitario", OTRO: "Otro" };
  return labels[value];
}

export function getStatusLabel(value: PublicCar["status"]) {
  const labels = { BORRADOR: "Borrador", PUBLICADO: "Disponible", RESERVADO: "Reservado", VENDIDO: "Vendido" };
  return labels[value];
}

export function getTagLabel(value: PublicCar["tag"]) {
  if (!value) return null;
  const labels = { CERO_KM: "0 KM", RECIEN_INGRESADO: "Recién ingresado", OPORTUNIDAD: "Oportunidad", FINANCIABLE: "Financiable" };
  return labels[value];
}
