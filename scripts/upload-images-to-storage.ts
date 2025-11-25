#!/usr/bin/env tsx

/**
 * Upload Images to Supabase Storage
 * 
 * This script uploads sample artwork images to Supabase Storage bucket.
 * 
 * Usage:
 *   npm run upload-images
 *   or
 *   npx tsx scripts/upload-images-to-storage.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = "artwork-images";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing required environment variables:");
  console.error("   - SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Image files to upload (from public directory)
const imagesToUpload = [
  { localPath: "public/artwork-landscape-1.jpg", storagePath: "artwork-landscape-1.jpg" },
  { localPath: "public/artwork-winter-1.jpg", storagePath: "artwork-winter-1.jpg" },
  { localPath: "public/artwork-fluid-1.jpg", storagePath: "artwork-fluid-1.jpg" },
  { localPath: "public/artwork-impasto-1.jpg", storagePath: "artwork-impasto-1.jpg" },
  { localPath: "public/artwork-still-life-1.jpg", storagePath: "artwork-still-life-1.jpg" },
  { localPath: "public/hero-banner.jpg", storagePath: "hero-banner.jpg" },
  { localPath: "public/portrait.jpg", storagePath: "portrait.jpg" },
  { localPath: "public/logo.svg", storagePath: "logo.svg" },
];

async function createBucket() {
  console.log(`🪣 Checking if bucket '${BUCKET_NAME}' exists...`);
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    throw new Error(`Failed to list buckets: ${listError.message}`);
  }

  const bucketExists = buckets?.some((b) => b.name === BUCKET_NAME);

  if (!bucketExists) {
    console.log(`📦 Creating bucket '${BUCKET_NAME}'...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/webp"],
    });

    if (createError) {
      throw new Error(`Failed to create bucket: ${createError.message}`);
    }
    console.log("✅ Bucket created successfully\n");
  } else {
    console.log("✅ Bucket already exists\n");
  }
}

async function uploadImage(localPath: string, storagePath: string) {
  const fullPath = resolve(process.cwd(), localPath);
  
  if (!existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${localPath} - file not found`);
    return false;
  }

  console.log(`📤 Uploading ${localPath}...`);

  try {
    const fileBuffer = readFileSync(fullPath);
    const mimeType = localPath.endsWith(".svg") 
      ? "image/svg+xml" 
      : localPath.endsWith(".png")
      ? "image/png"
      : "image/jpeg";

    // Delete existing file if it exists
    await supabase.storage.from(BUCKET_NAME).remove([storagePath]);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error(`   ❌ Failed: ${uploadError.message}`);
      return false;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    console.log(`   ✅ Uploaded: ${publicUrl}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error: ${error instanceof Error ? error.message : error}`);
    return false;
  }
}

async function uploadAllImages() {
  console.log("🎨 Starting image upload to Supabase Storage...\n");

  try {
    // Step 1: Create bucket if needed
    await createBucket();

    // Step 2: Upload all images
    console.log("📸 Uploading images...\n");
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    for (const image of imagesToUpload) {
      const result = await uploadImage(image.localPath, image.storagePath);
      if (result === false) {
        if (existsSync(resolve(process.cwd(), image.localPath))) {
          failCount++;
        } else {
          skipCount++;
        }
      } else {
        successCount++;
      }
    }

    // Summary
    console.log("\n📊 Upload Summary:");
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ⚠️  Skipped: ${skipCount}`);
    console.log(`   ❌ Failed: ${failCount}`);

    if (skipCount > 0) {
      console.log("\n💡 Note: Some images were skipped because they don't exist in the public directory.");
      console.log("   You can add placeholder images or replace them with actual artwork later.");
    }

    console.log("\n🎉 Image upload process completed!");
    
    // Show bucket URL
    console.log(`\n🔗 Storage bucket URL: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/`);
    
  } catch (error) {
    console.error("\n❌ Error uploading images:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

uploadAllImages();

