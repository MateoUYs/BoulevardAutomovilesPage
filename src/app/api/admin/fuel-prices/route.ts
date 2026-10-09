import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fuelPriceInputSchema } from "@/lib/validations";

export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = fuelPriceInputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos invalidos.", issues: parsed.error.flatten() }, { status: 400 });

  try {
    const current = await prisma.fuelPriceSetting.findFirst({ orderBy: { updatedAt: "desc" } });
    const fuel = current
      ? await prisma.fuelPriceSetting.update({ where: { id: current.id }, data: parsed.data })
      : await prisma.fuelPriceSetting.create({ data: parsed.data });
    return NextResponse.json({ fuel });
  } catch {
    return NextResponse.json({ error: "No se pudieron guardar los precios." }, { status: 500 });
  }
}
