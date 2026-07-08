import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const TARGETS = [
  path.join(ROOT, "assets", "works"),
  path.join(ROOT, "assets", "photo.png"),
];

const MAX_SIZE = 1600;
const JPEG_QUALITY = 82;

async function compressFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) return null;

  const before = fs.statSync(filePath).size;
  const inputBuffer = fs.readFileSync(filePath);

  let pipeline = sharp(inputBuffer).rotate();
  const meta = await pipeline.metadata();

  if ((meta.width || 0) > MAX_SIZE || (meta.height || 0) > MAX_SIZE) {
    pipeline = pipeline.resize({
      width: MAX_SIZE,
      height: MAX_SIZE,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, effort: 10 });
  } else {
    pipeline = pipeline.webp({ quality: 82 });
  }

  const buffer = await pipeline.toBuffer();
  fs.writeFileSync(filePath, buffer);

  const after = fs.statSync(filePath).size;
  return { before, after };
}

async function main() {
  const files = [];

  for (const target of TARGETS) {
    if (fs.statSync(target).isDirectory()) {
      for (const name of fs.readdirSync(target)) {
        files.push(path.join(target, name));
      }
    } else {
      files.push(target);
    }
  }

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const result = await compressFile(file);
    if (!result) continue;

    totalBefore += result.before;
    totalAfter += result.after;

    const name = path.basename(file);
    const saved = ((1 - result.after / result.before) * 100).toFixed(0);
    console.log(
      `${name}: ${(result.before / 1024 / 1024).toFixed(2)} MB → ${(result.after / 1024 / 1024).toFixed(2)} MB (−${saved}%)`
    );
  }

  console.log(
    `\nИтого: ${(totalBefore / 1024 / 1024).toFixed(2)} MB → ${(totalAfter / 1024 / 1024).toFixed(2)} MB`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
