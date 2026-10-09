import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth";
import { findVehicleSpecs } from "@/lib/specs-provider";

const requestSchema = z.object({
  brand: z.string().min(2),
  model: z.string().min(1),
  year: z.number().int().min(1950).max(new Date().getFullYear() + 1),
  category: z.enum(["SEDAN", "HATCHBACK", "SUV", "PICKUP", "UTILITARIO", "OTRO"]).optional().nullable(),
});

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Marca, modelo y año son obligatorios." }, { status: 400 });

  const specs = await findVehicleSpecs(parsed.data);
  return NextResponse.json({ specs });
}
