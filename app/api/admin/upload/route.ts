import { randomUUID } from "crypto"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UPLOAD_DIR, PUBLIC_PREFIX } from "@/lib/uploads"

export const runtime = "nodejs"

const MAX_BYTES = 6 * 1024 * 1024
const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
}

export async function POST(req: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 })
  }
  const ext = EXT[file.type]
  if (!ext) {
    return NextResponse.json({ error: `Tipo no permitido: ${file.type || "desconocido"}` }, { status: 415 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "El archivo supera 6 MB" }, { status: 413 })
  }

  const filename = `${randomUUID()}.${ext}`
  await mkdir(UPLOAD_DIR, { recursive: true })
  await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()))

  const url = `${PUBLIC_PREFIX}/${filename}`
  await prisma.asset.create({
    data: { filename, url, mime: file.type, bytes: file.size },
  })

  return NextResponse.json({ url, filename })
}

export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const assets = await prisma.asset.findMany({ orderBy: { createdAt: "desc" }, take: 100 })
  return NextResponse.json({ assets })
}
