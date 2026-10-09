export type PublishStatus = "BORRADOR" | "PUBLICADO" | "RESERVADO" | "VENDIDO";
export type FuelType = "NAFTA" | "DIESEL" | "HIBRIDO" | "ELECTRICO" | "FLEX" | "OTRO";
export type Transmission = "MANUAL" | "AUTOMATICA" | "CVT" | "OTRA";
export type VehicleCategory = "SEDAN" | "HATCHBACK" | "SUV" | "PICKUP" | "UTILITARIO" | "OTRO";
export type CarTag = "CERO_KM" | "RECIEN_INGRESADO" | "OPORTUNIDAD" | "FINANCIABLE";

export type PublicCarImage = {
  url: string;
  alt: string;
  order: number;
  isCover: boolean;
};

export type PublicCar = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  version: string | null;
  year: number;
  mileageKm: number;
  priceUsd: number;
  condition?: "NUEVO" | "USADO";
  status: PublishStatus;
  category: VehicleCategory | null;
  showWhenSold?: boolean;
  fuelType: FuelType | null;
  transmission: Transmission | null;
  engine: string | null;
  engineCapacity: string | null;
  powerHp: number | null;
  tankCapacityL?: number | null;
  doors: number | null;
  seats: number | null;
  cityKmPerLiter: number | null;
  roadKmPerLiter: number | null;
  safetyNotes?: string | null;
  specsSource?: "NHTSA" | "FUELECONOMY" | "CARQUERY" | "AI_ESTIMADO" | "MANUAL" | null;
  specsReviewed?: boolean;
  specsReviewNote?: string | null;
  tag: CarTag | null;
  description: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  images: PublicCarImage[];
};

export type CatalogFilters = {
  q?: string;
  brand?: string;
  year?: string;
  fuel?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
};

export type FuelPriceConfig = {
  gasolinePriceUyu: number;
  dieselPriceUyu: number;
  electricKwhUyu: number | null;
};

export type CatalogResult = {
  cars: PublicCar[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  brands: string[];
  years: number[];
  fuels: FuelType[];
};
