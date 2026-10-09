import "server-only";

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const adminSessionCookie = "boulevard_admin_session";

type AdminSession = {
  email: string;
  name: string;
  role: "ADMIN";
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is required");
  return new TextEncoder().encode(secret);
}

export async function signAdminSession(payload: AdminSession) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
}

export async function verifyAdminSession(token?: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "ADMIN" || typeof payload.email !== "string" || typeof payload.name !== "string") return null;
    return payload as AdminSession;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(adminSessionCookie)?.value);
}

export async function validateAdminCredentials(email: string, password: string) {
  const envEmail = process.env.ADMIN_EMAIL;
  const envPassword = process.env.ADMIN_PASSWORD;

  if (envEmail && envPassword && email === envEmail && password === envPassword) {
    return { email: envEmail, name: "Administrador Boulevard", role: "ADMIN" as const };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== "ADMIN") return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? { email: user.email, name: user.name, role: "ADMIN" as const } : null;
  } catch {
    return null;
  }
}
