import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { hasR2Config, uploadToR2 } from "@/lib/r2-admin";
import { getStorageBucket, getSupabaseAdmin } from "@/lib/supabase-admin";

const extensionByType: Record<string, string> = {
  "image/avif": "avif",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg",
  "image/webp": "webp",
};

function getImageExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  return extensionByType[file.type] ?? extension ?? "jpg";
}

function isImageFile(file: File) {
  const extension = getImageExtension(file);
  return file.type.startsWith("image/") || ["avif", "gif", "heic", "heif", "jpeg", "jpg", "png", "webp"].includes(extension);
}

function getUploadErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");

  if (message.includes("exceed_cached_egress_quota") || message.includes("restricted due to")) {
    return "Supabase Storage restringio el proyecto por superar la cuota de transferencia. Hay que actualizar el plan o quitar el limite de gasto en Supabase para volver a subir imagenes.";
  }

  return message || "No se pudo subir la imagen.";
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibio ningun archivo." }, { status: 400 });
  }

  if (!isImageFile(file)) {
    return NextResponse.json({ error: "Formato no permitido. Subí un archivo de imagen." }, { status: 400 });
  }

  if (file.size > 15_000_000) {
    return NextResponse.json({ error: "La imagen no puede superar 15 MB." }, { status: 400 });
  }

  try {
    const extension = getImageExtension(file);
    const path = `vehiculos/${new Date().getFullYear()}/${randomUUID()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || `image/${extension}`;

    if (hasR2Config()) {
      const upload = await uploadToR2(path, buffer, contentType);
      return NextResponse.json(upload);
    }

    const supabase = getSupabaseAdmin();
    const bucket = getStorageBucket();

    const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType,
      upsert: false,
    });

    if (error) {
      return NextResponse.json({ error: getUploadErrorMessage(error) }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path });
  } catch (error) {
    return NextResponse.json(
      { error: getUploadErrorMessage(error) },
      { status: 500 },
    );
  }
}
