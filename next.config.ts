import type { NextConfig } from "next";

/**
 * Static export for CDN / object storage / GitHub Pages.
 * When GITHUB_PAGES=true, assets use the project-site base path
 * https://<user>.github.io/anaglyph-studio-g-web/
 */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoBase = "/anaglyph-studio-g-web";

const nextConfig: NextConfig = {
  output: "export",
  // Directory-style routes (demo/index.html) work more reliably on static hosts.
  trailingSlash: true,
  basePath: isGitHubPages ? repoBase : "",
  assetPrefix: isGitHubPages ? `${repoBase}/` : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
