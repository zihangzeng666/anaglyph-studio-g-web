"use client";

import { useCallback, useMemo, useState } from "react";
import { trackDemoSubmit } from "@/lib/analytics";

type DemoFormProps = {
  /** Override mailto target */
  mailto?: string;
  /** Formspree form id — when set, POST instead of mailto */
  formspreeId?: string;
};

/**
 * Request-demo form.
 * - Default: mailto: with prefilled subject/body (static-export friendly).
 * - Formspree-ready: set NEXT_PUBLIC_FORMSPREE_ID to enable HTTPS POST.
 */
export function DemoForm({
  mailto = process.env.NEXT_PUBLIC_DEMO_MAILTO || "demo@example.com",
  formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID || "",
}: DemoFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const mode = formspreeId ? "formspree" : "mailto";

  const formspreeAction = useMemo(
    () =>
      formspreeId
        ? `https://formspree.io/f/${formspreeId}`
        : undefined,
    [formspreeId],
  );

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("sending");

      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        company ? `Company: ${company}` : null,
        "",
        message || "(no message)",
      ]
        .filter((l) => l !== null)
        .join("\n");

      if (mode === "formspree" && formspreeAction) {
        try {
          const res = await fetch(formspreeAction, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              company,
              message,
              _subject: "Anaglyph Studio (G) demo request",
            }),
          });
          if (!res.ok) throw new Error("formspree error");
          trackDemoSubmit("formspree");
          setStatus("sent");
        } catch {
          setStatus("error");
        }
        return;
      }

      const subject = encodeURIComponent("Anaglyph Studio (G) demo request");
      const body = encodeURIComponent(bodyLines);
      trackDemoSubmit("mailto");
      window.location.href = `mailto:${mailto}?subject=${subject}&body=${body}`;
      setStatus("sent");
    },
    [name, email, company, message, mode, formspreeAction, mailto],
  );

  const fieldClass =
    "w-full rounded-sm border border-[var(--border)] bg-frame/60 px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-sm border border-[var(--border)] bg-panel/50 p-6"
      noValidate={false}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-mono text-xs tracking-wide text-muted">
            Name
          </span>
          <input
            required
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-mono text-xs tracking-wide text-muted">
            Work email
          </span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1.5 block font-mono text-xs tracking-wide text-muted">
          Company <span className="text-muted/70">(optional)</span>
        </span>
        <input
          name="company"
          autoComplete="organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-mono text-xs tracking-wide text-muted">
          What would you like to see?
        </span>
        <textarea
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Build · PnP on our mould geometry, Load · track with IC4…"
          className={fieldClass}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-[var(--ink-on-accent)] transition-colors hover:bg-accent-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hi disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Request demo"}
        </button>
        <p className="font-mono text-[11px] text-muted">
          {mode === "formspree"
            ? "Submits via Formspree"
            : `Opens mail to ${mailto}`}
        </p>
      </div>

      {status === "sent" ? (
        <p className="text-sm text-[var(--ok)]" role="status">
          {mode === "mailto"
            ? "Your mail client should open with a prefilled message."
            : "Thanks — we received your request."}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-[var(--bad)]" role="alert">
          Something went wrong. Try again or email {mailto} directly.
        </p>
      ) : null}
    </form>
  );
}
