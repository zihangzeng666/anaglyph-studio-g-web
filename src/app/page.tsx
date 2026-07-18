export default function HomePage() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <main
        id="main"
        className="mx-auto flex min-h-[70vh] max-w-6xl flex-col px-6 py-16"
      >
        {/* Section slots land in later PRs (hero, pipeline, paths, …) */}
      </main>
    </>
  );
}
