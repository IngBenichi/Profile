import { createReadStream } from "fs"
import { stat } from "fs/promises"
import path from "path"
import { UPLOAD_DIR } from "@/lib/uploads"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
}

// Fallback for serving uploaded images. In production nginx serves /uploads/*
// directly from the shared volume; this route covers local dev and resilience.
export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params
  const rel = parts.join("/")
  if (rel.includes("..") || rel.startsWith("/")) return new Response("bad path", { status: 400 })

  const file = path.join(UPLOAD_DIR, rel)
  try {
    const info = await stat(file)
    if (!info.isFile()) throw new Error("not a file")
    const stream = createReadStream(file) as unknown as ReadableStream
    return new Response(stream, {
      headers: {
        "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch {
    return new Response("not found", { status: 404 })
  }
}
