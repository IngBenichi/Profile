"use client";

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect } from "react";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const initialTheme = "light"; // Set a static default theme for server-side rendering

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    console.log("Applying theme:", theme); // Debugging log
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.className = theme; // Synchronize className with data-theme
  }, []);

  return (
    <html lang="en" data-theme={initialTheme} className={initialTheme}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
