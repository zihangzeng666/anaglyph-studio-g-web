/**
 * Optional Lighthouse CI stub — not wired into npm scripts by default.
 * Run after `npm run build` when soft-launch URL or static server is available:
 *   npx --yes @lhci/cli autorun --config=lighthouserc.cjs
 *
 * Budgets are advisory until baselined (see docs/PERF.md).
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: "./out",
      numberOfRuns: 1,
      url: ["/", "/download", "/demo"],
      settings: {
        preset: "desktop",
        // Skip full throttling for local smoke; enable in CI when ready
        // throttlingMethod: "devtools",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.8 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.9 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
