/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static HTML export. `next build` writes the result to ./out.
  //
  // Do NOT set distDir here. Next treats a custom distDir as a request to
  // swap the export output directory (see hasCustomExportOutput in
  // next/dist/build/index.js), which redirects the export away from ./out
  // and breaks the deploy layout.
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
