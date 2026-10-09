export const siteConfig = {
  name: "Boulevard Automóviles",
  legalName: "Boulevard Automóviles",
  location: "Rosario, Uruguay",
  streetAddress: process.env.NEXT_PUBLIC_STREET_ADDRESS ?? "Direccion comercial",
  postalCode: "70200",
  addressLocality: "Rosario",
  addressRegion: "Colonia",
  addressCountry: "UY",
  areaServed: ["Uruguay", "Colonia", "Rosario", "Nueva Helvecia", "Juan Lacaze"],
  businessHours: "Lunes a sábado de 8:00 a 18:00",
  openingHours: "Mo-Sa 08:00-18:00",
  experience: "+20 años en el rubro automotor",
  primaryPhoneDisplay: process.env.NEXT_PUBLIC_PRIMARY_PHONE ?? "000 000 000",
  primaryPhoneIntl: process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "59800000000",
  primaryPhoneTel: `+${process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "59800000000"}`,
  secondaryPhoneDisplay: process.env.NEXT_PUBLIC_SECONDARY_PHONE ?? "",
  secondaryPhoneTel: process.env.NEXT_PUBLIC_SECONDARY_PHONE ? `+${process.env.NEXT_PUBLIC_SECONDARY_PHONE.replace(/\D/g, "")}` : "",
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
  instagramHandle: "@tu-cuenta",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/tu-cuenta/",
  googleMapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ?? "",
  googleMapsEmbedUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? "",
  logoPath: "/brand/boulevard-logo-tight.png",
  ogImagePath: "/opengraph-image",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.boulevardautomoviles.uy",
  description: "Boulevard Automóviles, automotora en Uruguay con local en Rosario. Venta, compra y permuta de autos usados, financiación bancaria y atención directa por WhatsApp.",
};

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${siteConfig.primaryPhoneIntl}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppUrl() {
  return buildWhatsAppUrl("Hola Boulevard Automóviles, quiero hacer una consulta.");
}

export function buildVehicleWhatsAppUrl(vehicleName: string, vehicleUrl?: string) {
  const message = vehicleUrl
    ? `Hola Boulevard Automóviles, consulto por el ${vehicleName}.\n${vehicleUrl}`
    : `Hola Boulevard Automóviles, consulto por el ${vehicleName}.`;

  return buildWhatsAppUrl(message);
}

export function buildTestDriveWhatsAppUrl(vehicleName: string, vehicleUrl?: string) {
  const message = vehicleUrl
    ? `Hola, quiero agendar un test drive del ${vehicleName}.\n${vehicleUrl}`
    : `Hola, quiero agendar un test drive del ${vehicleName}.`;

  return buildWhatsAppUrl(message);
}
