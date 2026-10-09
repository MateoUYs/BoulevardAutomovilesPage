import "server-only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
};

function readR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET?.trim();
  const publicUrl = process.env.R2_PUBLIC_URL?.trim().replace(/\/+$/, "");

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) return null;

  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl };
}

export function hasR2Config() {
  return readR2Config() !== null;
}

export async function uploadToR2(path: string, body: Buffer, contentType: string) {
  const config = readR2Config();
  if (!config) throw new Error("Cloudflare R2 no esta configurado.");

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  await client.send(new PutObjectCommand({
    Bucket: config.bucket,
    Key: path,
    Body: body,
    ContentType: contentType,
  }));

  return {
    path,
    url: `${config.publicUrl}/${path}`,
  };
}
