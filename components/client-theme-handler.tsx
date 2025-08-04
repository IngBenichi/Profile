"use client";

import { useEffect } from "react";

export default function ClientThemeHandler(): null {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.className = theme;
  }, []);

  return null;
}
