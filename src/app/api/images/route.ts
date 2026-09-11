import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ApiShape = Record<string, string[]>;

const folders = ["Featured", "Portraits", "Street"] as const;
const imageName = /\.(jpe?g|png|webp|gif)$/i;
const copyStem = /(?:\s+|-)copy(?:\s*\(\d+\))?$/i;
const numberedCopy = /\(\d+\)$/;

function listPhotos(dir: string, folder: (typeof folders)[number]) {
  const seen = new Set<string>();
  return fs
    .readdirSync(dir)
    .filter((fn) => imageName.test(fn))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .filter((fn) => {
      try {
        return fs.statSync(path.join(dir, fn)).size > 8_192;
      } catch {
        return false;
      }
    })
    .filter((fn) => {
      const stem = fn.replace(/\.[^.]+$/, "");
      if (copyStem.test(stem)) return false;
      if (folder !== "Featured" && numberedCopy.test(stem)) return false;
      const key = stem.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((fn) => `/${folder}/${encodeURI(fn)}`);
}

export async function GET() {
  const publicDir = path.join(process.cwd(), "public");
  const out: ApiShape = {};

  for (const folder of folders) {
    const dir = path.join(publicDir, folder);
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        out[folder] = [];
        continue;
      }
      out[folder] = listPhotos(dir, folder);
    } catch {
      out[folder] = [];
    }
  }

  return NextResponse.json(out, {
    headers: { "Cache-Control": "no-store" },
  });
}
