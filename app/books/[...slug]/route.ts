import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const BOOKS_DIR = path.join(process.cwd(), "books");

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".md": "text/markdown; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

// Serve static files from the books/ directory (project root).
// Route: /books/<slug>/<file>
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const relPath = slug.join("/");
  const filePath = path.join(BOOKS_DIR, relPath);

  // Prevent path traversal
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(BOOKS_DIR))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const ext = path.extname(resolved).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";

  const data = fs.readFileSync(resolved);
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
