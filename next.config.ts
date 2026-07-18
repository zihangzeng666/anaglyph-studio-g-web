import type { NextConfig } from "next";

/**
 * Static export for CDN / object storage / GitHub Pages.
 * When GITHUB_PAGES=true, assets use the project-site base path
 * https://<user>.github.io/anaglyph-studio-g-web/
 */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoBase = "/anaglyph-studio-g-web";

const basePath = isGitHubPages ? repoBase : "";

const nextConfig: NextConfig = {
  output: "export",
  // Directory-style routes (demo/index.html) work more reliably on static hosts.
  trailingSlash: true,
  basePath,
  assetPrefix: isGitHubPages ? `${repoBase}/` : undefined,
  // Client + content modules need this for /media/* under project Pages.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
