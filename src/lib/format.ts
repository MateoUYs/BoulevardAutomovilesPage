const uyNumberFormatter = new Intl.NumberFormat("es-UY");

export function formatUsd(price: number) {
  return `USD ${uyNumberFormatter.format(price)}`;
}

export function formatMileage(km: number) {
  return `${uyNumberFormatter.format(km)} km`;
}

export function formatKmPerLiter(value: number | null | undefined) {
  if (typeof value !== "number") return "No disponible";

  return `${new Intl.NumberFormat("es-UY", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value)} km/l`;
}

export function formatUyu(value: number) {
  return `$ ${uyNumberFormatter.format(Math.round(value))}`;
}
