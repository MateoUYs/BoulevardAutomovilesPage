import { NextResponse } from "next/server";
import { z } from "zod";
import { adminSessionCookie, signAdminSession, validateAdminCredentials } from "@/lib/auth";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos." }, { status: 400 });
  }

  const admin = await validateAdminCredentials(parsed.data.email, parsed.data.password);
  if (!admin) {
    return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
  }

  const token = await signAdminSession(admin);
  const response = NextResponse.json({ ok: true });
  const isSecureRequest =
    request.headers.get("x-forwarded-proto") === "https" || new URL(request.url).protocol === "https:";

  response.cookies.set(adminSessionCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureRequest,
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
