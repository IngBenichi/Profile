"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth-actions";

const SG = "var(--font-space-grotesk), 'Space Grotesk', sans-serif";
const MONO = "var(--font-jetbrains-mono), 'JetBrains Mono', monospace";
const BODY = "var(--font-inter), 'Inter', sans-serif";

const CSS = `
@keyframes alPulse { 0%,100% { opacity: 1 } 50% { opacity: .25 } }
@keyframes alBoot { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
@keyframes alCaret { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
@keyframes alSpin { to { transform: rotate(360deg) } }
.al-field {
  width: 100%; box-sizing: border-box;
  font-family: ${MONO}; font-size: 14px;
  color: oklch(0.96 0.003 250);
  background: oklch(0.12 0.005 250);
  border: 1px solid oklch(1 0 0 / 0.14);
  border-radius: 8px; padding: 12px 14px; outline: none;
  transition: border-color .18s ease, box-shadow .18s ease;
}
.al-field::placeholder { color: oklch(0.45 0.01 250) }
.al-field:focus {
  border-color: oklch(0.75 0.14 150 / 0.7);
  box-shadow: 0 0 0 3px oklch(0.75 0.14 150 / 0.14);
}
.al-btn {
  width: 100%; font-family: ${BODY}; font-weight: 600; font-size: 14px;
  background: oklch(0.96 0.003 250); color: oklch(0.15 0.006 250);
  border: none; border-radius: 8px; padding: 13px 20px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  transition: transform .12s ease, opacity .18s ease;
}
.al-btn:hover:not(:disabled) { transform: translateY(-1px) }
.al-btn:disabled { opacity: .55; cursor: default }
.al-link { color: oklch(0.6 0.012 250); text-decoration: none; transition: color .15s ease }
.al-link:hover { color: oklch(0.75 0.14 150) }
@media (prefers-reduced-motion: reduce) { .al-anim { animation: none !important } }
`;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/admin/dashboard");
      } else {
        setError(result.error || "Credenciales inválidas");
      }
    } catch {
      setError("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "oklch(0.15 0.006 250)",
        backgroundImage:
          "linear-gradient(oklch(1 0 0 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        color: "oklch(0.96 0.003 250)",
        fontFamily: BODY,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 640,
          height: 640,
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, oklch(0.75 0.14 150 / 0.12), transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          border: "1px solid oklch(1 0 0 / 0.1)",
          borderRadius: 14,
          background: "oklch(0.16 0.006 250 / 0.72)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 40px 80px -40px oklch(0 0 0 / 0.7)",
          overflow: "hidden",
          animation: "alBoot 0.5s ease both",
        }}
      >
        {/* terminal chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            borderBottom: "1px solid oklch(1 0 0 / 0.08)",
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.06em",
            color: "oklch(0.55 0.01 250)",
          }}
        >
          <span style={{ display: "flex", gap: 6 }}>
            {["oklch(0.7 0.16 25)", "oklch(0.8 0.13 85)", "oklch(0.75 0.14 150)"].map((c) => (
              <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
            ))}
          </span>
          <span>benichi@auth: ~/admin</span>
        </div>

        <div style={{ padding: "30px 28px 26px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
            <span
              className="al-anim"
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "oklch(0.75 0.14 150)",
                boxShadow: "0 0 8px oklch(0.75 0.14 150 / 0.8)",
                animation: "alPulse 2.4s ease infinite",
              }}
            />
            <h1 style={{ fontFamily: SG, fontWeight: 700, fontSize: 20, letterSpacing: "0.04em", margin: 0 }}>
              BENICHI<span style={{ color: "oklch(0.55 0.01 250)" }}>://AUTH</span>
            </h1>
          </div>
          <p style={{ fontFamily: MONO, fontSize: 12, color: "oklch(0.55 0.01 250)", margin: "0 0 24px" }}>
            Acceso restringido — panel de administración
          </p>

          {error && (
            <div
              role="alert"
              style={{
                fontFamily: MONO,
                fontSize: 12.5,
                lineHeight: 1.5,
                color: "oklch(0.82 0.11 25)",
                background: "oklch(0.7 0.16 25 / 0.1)",
                border: "1px solid oklch(0.7 0.16 25 / 0.35)",
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 18,
              }}
            >
              <span style={{ opacity: 0.7 }}>! </span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <label
                htmlFor="email"
                style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em", color: "oklch(0.6 0.012 250)" }}
              >
                &gt; EMAIL
              </label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                className="al-field"
                placeholder="admin@benichi.dev"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <label
                htmlFor="password"
                style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em", color: "oklch(0.6 0.012 250)" }}
              >
                &gt; PASSWORD
              </label>
              <input
                id="password"
                type="password"
                className="al-field"
                placeholder="••••••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="al-btn" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? (
                <>
                  <span
                    className="al-anim"
                    style={{
                      width: 13,
                      height: 13,
                      border: "2px solid oklch(0.15 0.006 250 / 0.3)",
                      borderTopColor: "oklch(0.15 0.006 250)",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "alSpin 0.7s linear infinite",
                    }}
                  />
                  AUTENTICANDO…
                </>
              ) : (
                <>&gt; AUTENTICAR</>
              )}
            </button>
          </form>
        </div>

        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid oklch(1 0 0 / 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: MONO,
            fontSize: 11,
            color: "oklch(0.45 0.01 250)",
          }}
        >
          <a href="/" className="al-link">
            ← benichi.dev
          </a>
          <span>
            SESSION
            <span className="al-anim" style={{ animation: "alCaret 1.1s step-end infinite", marginLeft: 4 }}>
              _
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
