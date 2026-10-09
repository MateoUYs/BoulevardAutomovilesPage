import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { consumptionReferenceInputSchema } from "@/lib/validations";

export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = consumptionReferenceInputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos invalidos.", issues: parsed.error.flatten() }, { status: 400 });

  try {
    await prisma.$transaction(
      parsed.data.references.map((reference) =>
        prisma.consumptionReference.upsert({
          where: { category: reference.category },
          update: reference,
          create: reference,
        }),
      ),
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudieron guardar las referencias." }, { status: 500 });
  }
}
