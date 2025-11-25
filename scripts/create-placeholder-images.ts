#!/usr/bin/env tsx

/**
 * Create Placeholder Images
 * 
 * This script creates simple SVG placeholder images for testing.
 * Run this before upload-images-to-storage.ts if you don't have actual images yet.
 * 
 * Usage:
 *   npm run create-placeholders
 *   or
 *   npx tsx scripts/create-placeholder-images.ts
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

const publicDir = resolve(process.cwd(), "public");

if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

function createSVGPlaceholder(
  width: number,
  height: number,
  text: string,
  bgColor: string,
  textColor: string
): string {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
}

const placeholders = [
  {
    filename: "artwork-landscape-1.jpg",
    svg: createSVGPlaceholder(1200, 800, "Atrium Luminous", "#F4A460", "#2C2C34"),
  },
  {
    filename: "artwork-landscape-2.jpg",
    svg: createSVGPlaceholder(1200, 800, "Iarnă în Carpați", "#B0C4DE", "#2F4F4F"),
  },
  {
    filename: "artwork-abstract-1.jpg",
    svg: createSVGPlaceholder(1200, 800, "Texturi Abstracte", "#FF6347", "#4169E1"),
  },
  {
    filename: "artwork-still-life-1.jpg",
    svg: createSVGPlaceholder(1200, 800, "Detaliu Atrium", "#FFD700", "#8B4513"),
  },
  {
    filename: "portrait.jpg",
    svg: createSVGPlaceholder(800, 800, "Emil Ciubotaru", "#8B7355", "#FFFFFF"),
  },
];

console.log("🎨 Creating placeholder images...\n");

for (const placeholder of placeholders) {
  const filePath = resolve(publicDir, placeholder.filename);
  
  if (existsSync(filePath)) {
    console.log(`⚠️  Skipping ${placeholder.filename} - already exists`);
  } else {
    // Save as SVG (we'll just use .svg extension even though filename says .jpg)
    // This is fine for placeholders
    writeFileSync(filePath, placeholder.svg);
    console.log(`✅ Created ${placeholder.filename}`);
  }
}

console.log("\n🎉 Placeholder images created in public/ directory!");
console.log("\n💡 Next steps:");
console.log("   1. Run: npm run upload-images");
console.log("   2. Or replace these placeholders with actual artwork images");

