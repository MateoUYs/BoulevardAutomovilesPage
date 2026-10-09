import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  CarCondition,
  CarTag,
  FuelType,
  InquiryType,
  PrismaClient,
  PublishStatus,
  Role,
  SpecsSource,
  Transmission,
  VehicleCategory,
} from "@prisma/client";
import { buildCarSlug } from "../src/lib/slug";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? "postgresql://user:password@localhost:5432/boulevard",
  }),
});

const defaultImages = [
  "/autos-demo/local-chevrolet-cruze.jpeg",
  "/autos-demo/local-peugeot-208.jpeg",
  "/autos-demo/auto-demo-3.jpeg",
  "/autos-demo/auto-demo-4.jpeg",
];

const consumptionReferences = [
  {
    category: VehicleCategory.SEDAN,
    cityKmPerLiterAvg: 10.5,
    roadKmPerLiterAvg: 15.2,
    notes: "Referencia editable para sedanes nafta/diesel de uso familiar.",
  },
  {
    category: VehicleCategory.HATCHBACK,
    cityKmPerLiterAvg: 12.0,
    roadKmPerLiterAvg: 17.0,
    notes: "Referencia editable para hatchbacks compactos.",
  },
  {
    category: VehicleCategory.SUV,
    cityKmPerLiterAvg: 8.8,
    roadKmPerLiterAvg: 13.2,
    notes: "Referencia editable para SUV medianos.",
  },
  {
    category: VehicleCategory.PICKUP,
    cityKmPerLiterAvg: 8.2,
    roadKmPerLiterAvg: 12.1,
    notes: "Referencia editable para pickups de uso mixto.",
  },
  {
    category: VehicleCategory.UTILITARIO,
    cityKmPerLiterAvg: 9.4,
    roadKmPerLiterAvg: 13.8,
    notes: "Referencia editable para utilitarios.",
  },
];

const demoCars = [
  {
    id: "demo-chevrolet-cruze-2014",
    brand: "Chevrolet",
    model: "Cruze",
    version: "LT",
    year: 2014,
    mileageKm: 156000,
    priceUsd: 9800,
    condition: CarCondition.USADO,
    status: PublishStatus.PUBLICADO,
    category: VehicleCategory.SEDAN,
    fuelType: FuelType.NAFTA,
    transmission: Transmission.MANUAL,
    engine: "1.8 nafta",
    engineCapacity: "1.8 L",
    powerHp: 141,
    tankCapacityL: 60,
    doors: 4,
    seats: 5,
    cityKmPerLiter: 9.5,
    roadKmPerLiter: 14.0,
    specsSource: SpecsSource.MANUAL,
    specsReviewed: true,
    tag: CarTag.RECIEN_INGRESADO,
    description: "Auto demo para visualizar el catalogo inicial. Reemplazar por datos reales desde el admin.",
  },
  {
    id: "demo-peugeot-208-2018",
    brand: "Peugeot",
    model: "208",
    version: "Active",
    year: 2018,
    mileageKm: 92000,
    priceUsd: 12500,
    condition: CarCondition.USADO,
    status: PublishStatus.PUBLICADO,
    category: VehicleCategory.HATCHBACK,
    fuelType: FuelType.NAFTA,
    transmission: Transmission.MANUAL,
    engine: "1.2 nafta",
    engineCapacity: "1.2 L",
    powerHp: 82,
    tankCapacityL: 50,
    doors: 5,
    seats: 5,
    cityKmPerLiter: 12.2,
    roadKmPerLiter: 17.4,
    specsSource: SpecsSource.MANUAL,
    specsReviewed: true,
    tag: CarTag.OPORTUNIDAD,
    description: "Auto demo para ajustar tarjetas, galeria y comparador.",
  },
  {
    id: "demo-toyota-corolla-2016",
    brand: "Toyota",
    model: "Corolla",
    version: "XEI",
    year: 2016,
    mileageKm: 132000,
    priceUsd: 14900,
    condition: CarCondition.USADO,
    status: PublishStatus.RESERVADO,
    category: VehicleCategory.SEDAN,
    fuelType: FuelType.NAFTA,
    transmission: Transmission.AUTOMATICA,
    engine: "1.8 nafta",
    engineCapacity: "1.8 L",
    powerHp: 140,
    tankCapacityL: 55,
    doors: 4,
    seats: 5,
    cityKmPerLiter: 10.8,
    roadKmPerLiter: 15.6,
    specsSource: SpecsSource.MANUAL,
    specsReviewed: true,
    tag: CarTag.FINANCIABLE,
    description: "Demo reservado para probar badges de estado.",
  },
  {
    id: "demo-fiat-strada-2020",
    brand: "Fiat",
    model: "Strada",
    version: "Working",
    year: 2020,
    mileageKm: 83000,
    priceUsd: 15900,
    condition: CarCondition.USADO,
    status: PublishStatus.PUBLICADO,
    category: VehicleCategory.PICKUP,
    fuelType: FuelType.NAFTA,
    transmission: Transmission.MANUAL,
    engine: "1.4 nafta",
    engineCapacity: "1.4 L",
    powerHp: 85,
    tankCapacityL: 58,
    doors: 2,
    seats: 2,
    cityKmPerLiter: 10.0,
    roadKmPerLiter: 14.2,
    specsSource: SpecsSource.MANUAL,
    specsReviewed: true,
    tag: CarTag.OPORTUNIDAD,
    description: "Demo pickup para probar comparaciones entre categorias distintas.",
  },
  {
    id: "demo-renault-kangoo-2019",
    brand: "Renault",
    model: "Kangoo",
    version: "Express",
    year: 2019,
    mileageKm: 118000,
    priceUsd: 13500,
    condition: CarCondition.USADO,
    status: PublishStatus.BORRADOR,
    category: VehicleCategory.UTILITARIO,
    fuelType: FuelType.DIESEL,
    transmission: Transmission.MANUAL,
    engine: "1.5 diesel",
    engineCapacity: "1.5 L",
    powerHp: 90,
    tankCapacityL: 50,
    doors: 4,
    seats: 2,
    cityKmPerLiter: 14.0,
    roadKmPerLiter: 18.5,
    specsSource: SpecsSource.MANUAL,
    specsReviewed: true,
    description: "Demo borrador para probar el admin sin publicar automaticamente.",
  },
  {
    id: "demo-byd-seagull-2024",
    brand: "BYD",
    model: "Seagull",
    version: "EV",
    year: 2024,
    mileageKm: 0,
    priceUsd: 19900,
    condition: CarCondition.NUEVO,
    status: PublishStatus.VENDIDO,
    category: VehicleCategory.HATCHBACK,
    fuelType: FuelType.ELECTRICO,
    transmission: Transmission.AUTOMATICA,
    engine: "Motor electrico",
    powerHp: 74,
    doors: 5,
    seats: 4,
    specsSource: SpecsSource.AI_ESTIMADO,
    specsReviewed: false,
    specsReviewNote: "Demo de ficha estimada por IA pendiente de revision humana.",
    tag: CarTag.CERO_KM,
    showWhenSold: true,
    description: "Demo vendido para probar configuracion de visibilidad y advertencias de ficha tecnica.",
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the admin user");
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: "Administrador Boulevard", passwordHash, role: Role.ADMIN },
    create: { email: adminEmail, name: "Administrador Boulevard", passwordHash, role: Role.ADMIN },
  });

  await prisma.siteSetting.deleteMany();
  await prisma.siteSetting.create({
    data: {
      showSoldVehicles: false,
      whatsappPhoneIntl: process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "59800000000",
      primaryPhone: process.env.NEXT_PUBLIC_PRIMARY_PHONE ?? "000 000 000",
      secondaryPhone: process.env.NEXT_PUBLIC_SECONDARY_PHONE ?? "",
      instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
      businessHours: "Lunes a sabado. Confirmar horario por WhatsApp.",
      address: "Rosario, Uruguay",
    },
  });

  await prisma.fuelPriceSetting.deleteMany();
  await prisma.fuelPriceSetting.create({
    data: {
      gasolinePriceUyu: 78,
      dieselPriceUyu: 58,
      electricKwhUyu: 10,
      notes: "Valores demo. Actualizar desde el admin para calcular costo estimado cada 100 km.",
    },
  });

  for (const reference of consumptionReferences) {
    await prisma.consumptionReference.upsert({
      where: { category: reference.category },
      update: reference,
      create: reference,
    });
  }

  await prisma.inquiry.deleteMany({ where: { type: InquiryType.GENERAL } });
  await prisma.carImage.deleteMany();
  await prisma.car.deleteMany({ where: { id: { in: demoCars.map((car) => car.id) } } });

  for (const car of demoCars) {
    const slug = buildCarSlug({ brand: car.brand, model: car.model, year: car.year, id: car.id });
    await prisma.car.create({
      data: {
        ...car,
        slug,
        publishedAt: car.status === PublishStatus.PUBLICADO || car.status === PublishStatus.RESERVADO ? new Date() : null,
        images: {
          create: defaultImages.slice(0, 4).map((url, index) => ({
            url,
            order: index,
            isCover: index === 0,
            alt: `${car.brand} ${car.model} ${car.year} en Boulevard Automoviles`,
          })),
        },
      },
    });
  }

  await prisma.inquiry.create({
    data: {
      type: InquiryType.GENERAL,
      name: "Consulta demo",
      phone: process.env.NEXT_PUBLIC_PRIMARY_PHONE ?? "000 000 000",
      message: "Consulta de ejemplo para probar el panel.",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
