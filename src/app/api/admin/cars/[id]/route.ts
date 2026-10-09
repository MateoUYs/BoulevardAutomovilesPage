import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildCarSlug } from "@/lib/slug";
import { adminCarSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function nextPublishedAt(status: string, current: Date | null) {
  if (status === "BORRADOR") return null;
  return current ?? new Date();
}

function withTimeout<T>(promise: Promise<T>, milliseconds = 15000) {
  return Promise.race([
    promise,
    new Promise<T>((_resolve, reject) => {
      setTimeout(() => reject(new Error("DATABASE_TIMEOUT")), milliseconds);
    }),
  ]);
}

export async function PUT(request: Request, context: RouteContext) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = adminCarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = buildCarSlug({ brand: data.brand, model: data.model, year: data.year, id });

  try {
    const car = await withTimeout(prisma.$transaction(async (tx) => {
      const current = await tx.car.findUnique({ where: { id }, select: { publishedAt: true } });
      await tx.carImage.deleteMany({ where: { carId: id } });
      return tx.car.update({
        where: { id },
        data: {
          slug,
          brand: data.brand,
          model: data.model,
          version: data.version,
          year: data.year,
          mileageKm: data.mileageKm,
          priceUsd: data.priceUsd,
          condition: data.condition,
          status: data.status,
          category: data.category,
          showWhenSold: data.showWhenSold,
          fuelType: data.fuelType,
          transmission: data.transmission,
          engine: data.engine,
          engineCapacity: data.engineCapacity,
          powerHp: data.powerHp,
          tankCapacityL: data.tankCapacityL,
          doors: data.doors,
          seats: data.seats,
          cityKmPerLiter: data.cityKmPerLiter,
          roadKmPerLiter: data.roadKmPerLiter,
          safetyNotes: data.safetyNotes,
          specsSource: data.specsSource,
          specsReviewed: data.specsReviewed,
          specsReviewNote: data.specsReviewNote,
          tag: data.tag,
          description: data.description,
          publishedAt: nextPublishedAt(data.status, current?.publishedAt ?? null),
          images: {
            create: data.images.map((image, index) => ({
              url: image.url,
              alt: image.alt,
              order: index,
              isCover: image.isCover,
            })),
          },
        },
        select: { id: true, slug: true },
      });
    }));

    return NextResponse.json({ car });
  } catch (error) {
    if (error instanceof Error && error.message === "DATABASE_TIMEOUT") {
      return NextResponse.json({ error: "La base de datos tardó demasiado en responder. Probá de nuevo en unos segundos." }, { status: 504 });
    }

    return NextResponse.json({ error: "No se pudo actualizar. Verificá la conexión a la base de datos." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await context.params;

  try {
    await prisma.car.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo eliminar. Verificá la conexión a la base de datos." }, { status: 500 });
  }
}
