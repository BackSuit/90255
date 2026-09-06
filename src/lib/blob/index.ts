import { put, del } from "@vercel/blob";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/constants";

export async function uploadImage(
  file: File,
  folder: string = "uploads"
): Promise<string> {
  // Validate
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      `Invalid file type. Accepted: ${ACCEPTED_IMAGE_TYPES.join(", ")}`
    );
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(
      `File too large. Maximum size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
    );
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return blob.url;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error("Failed to delete image:", error);
    // Don't throw — image might already be deleted
  }
}
