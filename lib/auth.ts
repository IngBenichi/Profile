import { cookies } from "next/headers"

export async function getSession() {
  const cookieStore = cookies()
  const session = cookieStore.get("admin_session")

  if (session?.value === "authenticated") {
    return { authenticated: true }
  }

  return null
}
