import type { FuelPriceConfig, PublicCar } from "@/lib/car-types";

export function calculateCostPer100KmUyu(car: PublicCar, fuelPrices: FuelPriceConfig) {
  const kmPerLiter = car.roadKmPerLiter ?? car.cityKmPerLiter;
  if (!kmPerLiter || kmPerLiter <= 0) return null;

  if (car.fuelType === "DIESEL") return (100 / kmPerLiter) * fuelPrices.dieselPriceUyu;
  if (car.fuelType === "NAFTA" || car.fuelType === "HIBRIDO" || car.fuelType === "FLEX") {
    return (100 / kmPerLiter) * fuelPrices.gasolinePriceUyu;
  }

  return null;
}

export function allComparableValues<T>(cars: PublicCar[], selector: (car: PublicCar) => T | null | undefined) {
  const values = cars.map(selector);
  return values.every((value) => value !== null && value !== undefined && value !== "") ? values : null;
}

export function getBestNumericSlugs(cars: PublicCar[], selector: (car: PublicCar) => number | null | undefined, mode: "min" | "max") {
  const values = allComparableValues(cars, selector);
  if (!values) return new Set<string>();
  const numbers = values as number[];
  const best = mode === "min" ? Math.min(...numbers) : Math.max(...numbers);
  return new Set(cars.filter((car) => selector(car) === best).map((car) => car.slug));
}
