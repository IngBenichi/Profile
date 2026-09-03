import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono, Newsreader, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientThemeHandler from "@/components/client-theme-handler"; // Nuevo componente cliente

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SITE_URL = process.env.SITE_URL || "https://benichi.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Camilo Benítez — Backend Software Engineer",
  description:
    "Portafolio de Camilo Benítez (Benichi): Ingeniero de Software Backend — APIs, microservicios, Docker, cloud y ciberseguridad.",
  keywords: [
    "Camilo Benitez", "Benichi", "backend developer", "software engineer",
    "Django", "FastAPI", "Laravel", "Node.js", "Docker", "APIs", "microservicios",
  ],
  authors: [{ name: "Camilo Benítez" }],
  openGraph: {
    title: "Camilo Benítez — Backend Software Engineer",
    description:
      "Ingeniero de Software Backend — APIs, microservicios, Docker, cloud y ciberseguridad.",
    url: SITE_URL,
    siteName: "benichi.dev",
    type: "website",
    images: ["/profile.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Camilo Benítez — Backend Software Engineer",
    description: "Ingeniero de Software Backend — APIs, microservicios, Docker, cloud.",
    images: ["/profile.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1c1c22",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      data-theme="dark"
      className={`dark ${inter.variable} ${newsreader.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ClientThemeHandler />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
