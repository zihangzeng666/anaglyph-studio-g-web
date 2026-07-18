import Link from "next/link";

type UtilityPageProps = {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
};

/**
 * Thin chrome for secondary routes (download, source, demo, legal).
 */
export function UtilityPage({ title, eyebrow, children }: UtilityPageProps) {
  return (
    <main
      id="main"
      className="mx-auto min-h-[70vh] max-w-3xl px-6 py-16 md:py-20"
    >
      <p className="mb-4 font-mono text-xs tracking-[0.2em] text-accent uppercase">
        <Link
          href="/"
          className="text-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ← {eyebrow ?? "Studio G"}
        </Link>
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
        {title}
      </h1>
      <div className="mt-8 space-y-6 text-base leading-relaxed text-muted">
        {children}
      </div>
    </main>
  );
}
