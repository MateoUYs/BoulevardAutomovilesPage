import { jwtVerify } from "jose";

export const adminSessionCookie = "boulevard_admin_session";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is required");
  return new TextEncoder().encode(secret);
}

export async function verifyAdminToken(token?: string) {
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "ADMIN" && typeof payload.email === "string";
  } catch {
    return false;
  }
}
