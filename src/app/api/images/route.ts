import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

type ApiShape = Record<string, string[]>;

export async function GET() {
  const cwd = process.cwd();
  const publicDir = path.join(cwd, "public");
  const folders = ["Portraits", "Street"];
  const out: ApiShape = {};

  for (const f of folders) {
    const dir = path.join(publicDir, f);
    try {
      const files = fs.readdirSync(dir).filter((fn) => /\.(jpe?g|png|webp|gif)$/i.test(fn));
      out[f] = files.map((fn) => `/${f}/${encodeURI(fn)}`);
    } catch (e) {
      out[f] = [];
    }
  }

  return NextResponse.json(out);
}
