/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // CAPACITOR STATIC EXPORT (commented out - do NOT enable for Vercel deploys)
  // ============================================================================
  // Uncomment the lines below ONLY when building a static export for Capacitor
  // local file mode. This will break API routes (/api/*) since static export
  // does not support serverless functions.
  //
  // To use: uncomment these, run `npx next build`, then the /out directory
  // will contain the static site that Capacitor loads from bundled files.
  //
  // output: 'export',
  // images: { unoptimized: true },
};

export default nextConfig;
