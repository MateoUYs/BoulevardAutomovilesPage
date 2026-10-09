import { prisma } from "@/lib/prisma";
import { demoFuelPriceConfig } from "@/lib/demo-cars";
import type { PublicCar } from "@/lib/car-types";

const demoReferences = [
  { category: "SEDAN", cityKmPerLiterAvg: 10.5, roadKmPerLiterAvg: 15.2, notes: "Referencia editable para sedanes." },
  { category: "HATCHBACK", cityKmPerLiterAvg: 12, roadKmPerLiterAvg: 17, notes: "Referencia editable para hatchbacks." },
  { category: "SUV", cityKmPerLiterAvg: 8.8, roadKmPerLiterAvg: 13.2, notes: "Referencia editable para SUV." },
  { category: "PICKUP", cityKmPerLiterAvg: 8.2, roadKmPerLiterAvg: 12.1, notes: "Referencia editable para pickups." },
  { category: "UTILITARIO", cityKmPerLiterAvg: 9.4, roadKmPerLiterAvg: 13.8, notes: "Referencia editable para utilitarios." },
  { category: "OTRO", cityKmPerLiterAvg: 10, roadKmPerLiterAvg: 14, notes: "Referencia general." },
];

export async function getAdminCars() {
  try {
    const cars = await prisma.car.findMany({
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
    return cars as PublicCar[];
  } catch {
    return [];
  }
}

export async function getAdminCarById(id: string) {
  try {
    const car = await prisma.car.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    });
    return car as PublicCar | null;
  } catch {
    return null;
  }
}

export async function getAdminDashboard() {
  const cars = await getAdminCars();
  return {
    cars,
    total: cars.length,
    published: cars.filter((car) => car.status === "PUBLICADO").length,
    reserved: cars.filter((car) => car.status === "RESERVADO").length,
    sold: cars.filter((car) => car.status === "VENDIDO").length,
    drafts: cars.filter((car) => car.status === "BORRADOR").length,
  };
}

export async function getAdminSettings() {
  try {
    const [site, fuel, references] = await Promise.all([
      prisma.siteSetting.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.fuelPriceSetting.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.consumptionReference.findMany({ orderBy: { category: "asc" } }),
    ]);

    return {
      site: site ?? null,
      fuel: fuel ?? demoFuelPriceConfig,
      references: references.length ? references : demoReferences,
    };
  } catch {
    return {
      site: null,
      fuel: demoFuelPriceConfig,
      references: demoReferences,
    };
  }
}
