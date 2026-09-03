"use server"

import { cookies } from "next/headers"

export async function login(email: string, password: string) {
  // Check against environment variables
  const validEmail = process.env.ADMIN_EMAIL
  const validPassword = process.env.ADMIN_PASSWORD

  if (!validEmail || !validPassword) {
    return { success: false, error: "Credenciales de administrador no configuradas en el servidor" }
  }

  if (email === validEmail && password === validPassword) {
    // Set a session cookie
    cookies().set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return { success: true }
  }

  return { success: false, error: "Email o contraseña incorrectos" }
}

export async function logout() {
  cookies().delete("admin_session")
  return { success: true }
}
