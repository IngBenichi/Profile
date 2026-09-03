"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { removeRow, reorder } from "@/app/actions/admin";

export const SG = "var(--font-space-grotesk), 'Space Grotesk', sans-serif";
export const MONO = "var(--font-jetbrains-mono), 'JetBrains Mono', monospace";
export const BODY = "var(--font-inter), 'Inter', sans-serif";

export type Loc = { es: string; en: string };

export const KIT_CSS = `
.ak-in {
  width: 100%; box-sizing: border-box; font-family: ${MONO}; font-size: 13px;
  color: oklch(0.96 0.003 250); background: oklch(0.12 0.005 250);
  border: 1px solid oklch(1 0 0 / 0.14); border-radius: 7px; padding: 9px 11px; outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.ak-in:focus { border-color: oklch(0.75 0.14 150 / 0.7); box-shadow: 0 0 0 3px oklch(0.75 0.14 150 / 0.13); }
.ak-in::placeholder { color: oklch(0.42 0.01 250); }
textarea.ak-in { resize: vertical; min-height: 68px; line-height: 1.5; }
.ak-btn {
  font-family: ${BODY}; font-weight: 600; font-size: 13px; cursor: pointer;
  border-radius: 7px; padding: 9px 16px; border: 1px solid transparent;
  display: inline-flex; align-items: center; gap: 7px; transition: transform .1s ease, opacity .15s ease;
}
.ak-btn:hover:not(:disabled) { transform: translateY(-1px); }
.ak-btn:disabled { opacity: .5; cursor: default; }
.ak-btn-primary { background: oklch(0.75 0.14 150); color: oklch(0.14 0.02 160); }
.ak-btn-ghost { background: oklch(1 0 0 / 0.05); color: oklch(0.9 0.005 250); border-color: oklch(1 0 0 / 0.14); }
.ak-btn-danger { background: oklch(0.7 0.16 25 / 0.12); color: oklch(0.8 0.12 25); border-color: oklch(0.7 0.16 25 / 0.4); }
.ak-link { color: oklch(0.6 0.012 250); text-decoration: none; }
.ak-link:hover { color: oklch(0.75 0.14 150); }
`;

export function Btn({
  children,
  kind = "ghost",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: "primary" | "ghost" | "danger" }) {
  return (
    <button {...rest} className={`ak-btn ak-btn-${kind} ${rest.className ?? ""}`}>
      {children}
    </button>
  );
}

export function Panel({ title, children, right }: { title?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid oklch(1 0 0 / 0.1)",
        borderRadius: 12,
        background: "oklch(0.16 0.006 250 / 0.6)",
        marginBottom: 18,
      }}
    >
      {title && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid oklch(1 0 0 / 0.08)",
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "oklch(0.6 0.012 250)",
            textTransform: "uppercase",
          }}
        >
          <span>{title}</span>
          {right}
        </div>
      )}
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.09em", color: "oklch(0.55 0.01 250)", textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

export function Text({
  label,
  value,
  onChange,
  placeholder,
  area,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  area?: boolean;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <Label>{label}</Label>}
      {area ? (
        <textarea className="ak-in" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="ak-in" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

/** Bilingual field: ES + EN side by side. */
export function LocText({
  label,
  value,
  onChange,
  area,
}: {
  label: string;
  value: Loc;
  onChange: (v: Loc) => void;
  area?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Label>{label}</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {(["es", "en"] as const).map((k) => (
          <div key={k} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.12em", color: "oklch(0.45 0.01 250)" }}>{k.toUpperCase()}</span>
            {area ? (
              <textarea className="ak-in" value={value[k]} onChange={(e) => onChange({ ...value, [k]: e.target.value })} />
            ) : (
              <input className="ak-in" value={value[k]} onChange={(e) => onChange({ ...value, [k]: e.target.value })} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Editable string list (tech tags, achievements per language, …). */
export function StringList({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Label>{label}</Label>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", gap: 6 }}>
            <input
              className="ak-in"
              value={it}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
            />
            <Btn type="button" kind="danger" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              ✕
            </Btn>
          </div>
        ))}
        <div style={{ display: "flex", gap: 6 }}>
          <input
            className="ak-in"
            value={draft}
            placeholder="+ añadir…"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && draft.trim()) {
                e.preventDefault();
                onChange([...items, draft.trim()]);
                setDraft("");
              }
            }}
          />
          <Btn
            type="button"
            onClick={() => {
              if (draft.trim()) {
                onChange([...items, draft.trim()]);
                setDraft("");
              }
            }}
          >
            +
          </Btn>
        </div>
      </div>
    </div>
  );
}

/** Image field: shows current image, lets you upload a new one or type a path. */
export function ImagePicker({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al subir");
      onChange(json.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Label>{label}</Label>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div
          style={{
            width: 88,
            height: 66,
            flexShrink: 0,
            borderRadius: 8,
            border: "1px solid oklch(1 0 0 / 0.14)",
            background: "oklch(0.12 0.005 250)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontFamily: MONO, fontSize: 10, color: "oklch(0.45 0.01 250)" }}>sin imagen</span>
          )}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <input className="ak-in" value={value} placeholder="/imagen.png o /uploads/…" onChange={(e) => onChange(e.target.value)} />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Btn type="button" onClick={() => fileRef.current?.click()} disabled={busy}>
              {busy ? "Subiendo…" : "Subir archivo"}
            </Btn>
            {err && <span style={{ fontFamily: MONO, fontSize: 11, color: "oklch(0.8 0.12 25)" }}>{err}</span>}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** Wrap a server action; shows a transient "guardado" toast. */
export function useSaver() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const run = (fn: () => Promise<{ ok?: boolean; error?: string } | void>, okText = "Guardado") =>
    start(async () => {
      try {
        const r = await fn();
        if (r && "error" in r && r.error) setMsg({ ok: false, text: r.error });
        else setMsg({ ok: true, text: okText });
      } catch (e) {
        setMsg({ ok: false, text: (e as Error).message });
      }
      setTimeout(() => setMsg(null), 2600);
    });
  return { pending, msg, run };
}

export function RowCard({
  title,
  children,
  onSave,
  onDelete,
  onUp,
  onDown,
  pending,
  dirty,
}: {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  onDelete?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  pending?: boolean;
  dirty?: boolean;
}) {
  return (
    <div style={{ border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 11, background: "oklch(0.16 0.006 250 / 0.55)", marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "9px 12px",
          borderBottom: "1px solid oklch(1 0 0 / 0.07)",
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 12, color: "oklch(0.88 0.005 250)" }}>
          {title}
          {dirty && <span style={{ color: "oklch(0.8 0.13 85)", marginLeft: 8 }}>●</span>}
        </span>
        <div style={{ display: "flex", gap: 5 }}>
          {onUp && <Btn type="button" onClick={onUp}>▲</Btn>}
          {onDown && <Btn type="button" onClick={onDown}>▼</Btn>}
          <Btn type="button" kind="primary" onClick={onSave} disabled={pending}>
            {pending ? "…" : "Guardar"}
          </Btn>
          {onDelete && (
            <Btn type="button" kind="danger" onClick={onDelete} disabled={pending}>
              Eliminar
            </Btn>
          )}
        </div>
      </div>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}

type CrudModel = "timelineItem" | "credential" | "project" | "experience" | "contactLink" | "skillHub" | "skillItem";

export type Draft<T> = T & { _key: string; id?: number };

/** Shared list-CRUD state + server-action wiring for the admin list editors. */
export function useCrud<T extends { id?: number }>(opts: {
  model: CrudModel;
  initial: T[];
  blank: () => T;
  upsert: (row: T) => Promise<{ ok?: boolean; error?: string } | void>;
}) {
  const router = useRouter();
  const key = () => Math.random().toString(36).slice(2);
  const [rows, setRows] = useState<Draft<T>[]>(() => opts.initial.map((r) => ({ ...r, _key: key() })));
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  const flash = (ok: boolean, text: string) => {
    setToast({ ok, text });
    setTimeout(() => setToast(null), 2600);
  };
  const markDirty = (k: string) => setDirty((d) => new Set(d).add(k));
  const clearDirty = (k: string) =>
    setDirty((d) => {
      const n = new Set(d);
      n.delete(k);
      return n;
    });

  const patch = (k: string, part: Partial<T>) => {
    setRows((rs) => rs.map((r) => (r._key === k ? { ...r, ...part } : r)));
    markDirty(k);
  };
  const add = () => setRows((rs) => [...rs, { ...opts.blank(), _key: key() }]);

  const save = async (row: Draft<T>) => {
    setBusy(row._key);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _key, ...clean } = row;
      const r = await opts.upsert(clean as T);
      if (r && "error" in r && r.error) flash(false, r.error);
      else {
        flash(true, "Guardado");
        clearDirty(row._key);
        router.refresh();
      }
    } catch (e) {
      flash(false, (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const del = async (row: Draft<T>) => {
    if (row.id && !confirm("¿Eliminar este elemento?")) return;
    if (!row.id) {
      setRows((rs) => rs.filter((r) => r._key !== row._key));
      return;
    }
    setBusy(row._key);
    try {
      await removeRow(opts.model, row.id);
      setRows((rs) => rs.filter((r) => r._key !== row._key));
      flash(true, "Eliminado");
      router.refresh();
    } catch (e) {
      flash(false, (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const move = async (k: string, dir: -1 | 1) => {
    const i = rows.findIndex((r) => r._key === k);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
    const ids = next.filter((r) => r.id).map((r) => r.id!) as number[];
    if (ids.length) {
      try {
        await reorder(opts.model, ids);
        router.refresh();
      } catch (e) {
        flash(false, (e as Error).message);
      }
    }
  };

  return { rows, busy, toast, dirty, patch, add, save, del, move };
}

export function Toast({ toast }: { toast: { ok: boolean; text: string } | null }) {
  if (!toast) return null;
  return (
    <div
      style={{
        position: "fixed",
        right: 22,
        bottom: 22,
        zIndex: 100,
        fontFamily: MONO,
        fontSize: 12.5,
        padding: "10px 16px",
        borderRadius: 9,
        background: toast.ok ? "oklch(0.75 0.14 150 / 0.15)" : "oklch(0.7 0.16 25 / 0.15)",
        border: `1px solid ${toast.ok ? "oklch(0.75 0.14 150 / 0.5)" : "oklch(0.7 0.16 25 / 0.5)"}`,
        color: toast.ok ? "oklch(0.85 0.13 150)" : "oklch(0.82 0.12 25)",
      }}
    >
      {toast.ok ? "✓ " : "! "}
      {toast.text}
    </div>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Btn type="button" onClick={onClick} style={{ marginBottom: 16 }}>
      + {label}
    </Btn>
  );
}

export function PageHead({ title, hint }: { title: string; hint?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h1 style={{ fontFamily: SG, fontSize: 24, fontWeight: 700, margin: 0 }}>{title}</h1>
      {hint && <p style={{ fontFamily: MONO, fontSize: 11.5, color: "oklch(0.55 0.01 250)", margin: "6px 0 0" }}>{hint}</p>}
    </div>
  );
}

export function SaveBar({ pending, msg, onSave, extra }: { pending: boolean; msg: { ok: boolean; text: string } | null; onSave: () => void; extra?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
      <Btn kind="primary" onClick={onSave} disabled={pending}>
        {pending ? "Guardando…" : "› Guardar"}
      </Btn>
      {extra}
      {msg && (
        <span
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: msg.ok ? "oklch(0.8 0.13 150)" : "oklch(0.8 0.12 25)",
          }}
        >
          {msg.ok ? "✓ " : "! "}
          {msg.text}
        </span>
      )}
    </div>
  );
}
