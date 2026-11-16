import path from "node:path";
import fs from "node:fs";

export interface BusinessCoverImageInput {
  slug?: string | null;
  id?: string | number | null;
  name?: string | null;
  category?: string | null;
  coverImage?: string | null;
}

// Supported image extensions (including JPEG XL .jxl)
const IMAGE_EXT_REGEX = /\.(jpe?g|png|webp|avif|svg|gif|jxl)$/i;

/**
 * Checks if an image URL is a JPEG XL (.jxl) file.
 * JXL files bypass standard sharp optimization with `unoptimized` prop.
 */
export function isJxlImage(url?: string | null): boolean {
  if (!url) return false;
  return /\.jxl($|\?)/i.test(url);
}

// Cache scanned category directories in memory (TTL: 5 seconds for fast dev updates)
const CACHE_TTL_MS = 5000;
const categoryImagesCache = new Map<
  string,
  { timestamp: number; images: string[] }
>();

/**
 * Deterministically computes an index from a seed string and a list length.
 * Uses the DJB2 hash algorithm for uniform distribution across available images.
 * More images => lower repetition across businesses.
 */
export function getDeterministicIndex(seed: string, length: number): number {
  if (length <= 1) return 0;
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash * 33) ^ seed.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

/**
 * Returns candidate directory names for a given category slug to be forgiving
 * of naming conventions (e.g. "auto-repair", "auto_repair", "autorepair").
 */
function getCategoryFolderVariants(category: string): string[] {
  const normalized = category.trim().toLowerCase();
  const variants = new Set<string>();

  variants.add(normalized);
  variants.add(normalized.replace(/_/g, "-"));
  variants.add(normalized.replace(/-/g, "_"));
  variants.add(normalized.replace(/[-_ ]/g, ""));

  return Array.from(variants);
}

/**
 * Discovers available image files inside `public/category/[category_name]`.
 */
export function getCategoryImages(categoryName?: string | null): string[] {
  if (!categoryName) return [];

  const now = Date.now();
  const cacheKey = categoryName.trim().toLowerCase();
  const cached = categoryImagesCache.get(cacheKey);

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.images;
  }

  const basePublicDir = path.join(process.cwd(), "public");
  const folderVariants = getCategoryFolderVariants(categoryName);

  let foundImages: string[] = [];
  let resolvedRelativeDir = "";

  for (const variant of folderVariants) {
    const fullPath = path.join(basePublicDir, "category", variant);
    try {
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
        const files = fs.readdirSync(fullPath);
        const validImageFiles = files
          .filter((file) => !file.startsWith(".") && IMAGE_EXT_REGEX.test(file))
          .sort((a, b) => a.localeCompare(b));

        if (validImageFiles.length > 0) {
          resolvedRelativeDir = `/category/${variant}`;
          foundImages = validImageFiles.map(
            (file) => `${resolvedRelativeDir}/${file}`
          );
          break;
        }
      }
    } catch {
      // If directory cannot be accessed, continue searching
    }
  }

  // Update cache
  categoryImagesCache.set(cacheKey, { timestamp: now, images: foundImages });
  return foundImages;
}

/**
 * Returns a fallback cover image for a category.
 * If the category has multiple images in public/category/[category_name],
 * it deterministically selects one based on `seed` to minimize repetition.
 * If the category has no images, it falls back to "default" or "other".
 */
export function getCategoryFallbackImage(
  category?: string | null,
  seed: string = "default"
): string | null {
  const cat = category?.trim().toLowerCase() || "default";

  // 1. Try specified category
  let images = getCategoryImages(cat);

  // 2. Fall back to "default" if no images found
  if (images.length === 0 && cat !== "default") {
    images = getCategoryImages("default");
  }

  // 3. Fall back to "other" if still no images found
  if (images.length === 0 && cat !== "other") {
    images = getCategoryImages("other");
  }

  if (images.length === 0) {
    return null;
  }

  // Deterministically select an image from the pool
  const index = getDeterministicIndex(seed, images.length);
  return images[index];
}

/**
 * Resolves the cover image for a business.
 * - If business.coverImage is present and non-empty, returns it.
 * - If not, picks a deterministic cover image from `public/category/[category_name]`
 *   using the business's slug/id/name as seed so the same business consistently
 *   gets the same image across cards and detail pages with minimized repetition.
 */
export function getBusinessCoverImage(
  business: BusinessCoverImageInput | null | undefined
): string | null {
  if (!business) return null;

  if (business.coverImage && business.coverImage.trim() !== "") {
    return business.coverImage;
  }

  const seed =
    business.slug ||
    (business.id !== undefined && business.id !== null
      ? String(business.id)
      : "") ||
    business.name ||
    "business";

  return getCategoryFallbackImage(business.category, seed);
}

