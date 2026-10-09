import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { siteSettingsInputSchema } from "@/lib/validations";

export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = siteSettingsInputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos invalidos.", issues: parsed.error.flatten() }, { status: 400 });

  try {
    const current = await prisma.siteSetting.findFirst({ orderBy: { updatedAt: "desc" } });
    const setting = current
      ? await prisma.siteSetting.update({ where: { id: current.id }, data: parsed.data })
      : await prisma.siteSetting.create({ data: parsed.data });
    return NextResponse.json({ setting });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar la configuración." }, { status: 500 });
  }
}
