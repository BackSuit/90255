"use server";

import { uploadImage, deleteImage } from "@/lib/blob";
import { requireAuth } from "@/lib/auth";

export async function uploadImageAction(formData: FormData) {
  await requireAuth();

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  const folder = (formData.get("folder") as string) || "uploads";

  try {
    const url = await uploadImage(file, folder);
    return { url };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export async function deleteImageAction(url: string) {
  await requireAuth();

  try {
    await deleteImage(url);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}
