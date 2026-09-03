import path from "path"

/** Directory where uploaded images are stored (mounted as a Docker volume in prod). */
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "data", "uploads")

export const PUBLIC_PREFIX = "/uploads"
