// When hosting under a repository subpath (e.g. GitHub Pages at
// user.github.io/test-repo/), set PAGES_BASE_PATH=/test-repo at build time.
// Left empty for local dev and for custom-domain / root hosting.
const basePath = process.env.PAGES_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
};

export default nextConfig;
