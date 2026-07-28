"use client";

import { API_URL } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";

export async function requestSignedUpload(input: {
  prefix: "lessons" | "prompts" | "submissions";
  filename: string;
  contentType: string;
  userScoped?: boolean;
}) {
  const token = await getIdToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`${API_URL}/api/media/signed-upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      prefix: input.prefix,
      filename: input.filename,
      content_type: input.contentType,
      user_scoped: input.userScoped ?? false,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{
    mode: string;
    key: string;
    upload_url: string;
    method: string;
    headers: Record<string, string>;
  }>;
}

export async function uploadBlob(
  blob: Blob,
  filename: string,
  prefix: "lessons" | "prompts" | "submissions",
  contentType: string,
) {
  const signed = await requestSignedUpload({ prefix, filename, contentType, userScoped: prefix === "submissions" });
  const url = signed.upload_url.startsWith("http") ? signed.upload_url : `${API_URL}/api${signed.upload_url}`;
  const put = await fetch(url, {
    method: "PUT",
    headers: signed.headers,
    body: blob,
  });
  if (!put.ok) throw new Error("Upload failed");
  return signed.key;
}

export async function getDownloadUrl(key: string) {
  const token = await getIdToken();
  const res = await fetch(`${API_URL}/api/media/signed-download?key=${encodeURIComponent(key)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  const url = data.download_url.startsWith("http") ? data.download_url : `${API_URL}/api${data.download_url}`;
  return url as string;
}
