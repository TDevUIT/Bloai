/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import BundAnalyzer from '@next/bundle-analyzer'
/** @type {import("next").NextConfig} */

const config = {
  images: {
    domains: ['picsum.photos', 'lh3.googleusercontent.com','res.cloudinary.com', 'media.discordapp.net', 'images.unsplash.com', 'imgur.com', 'i.imgur.com'],
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
};

const withBundleAnalyzer = BundAnalyzer({
  enabled: process.env.ANALYZE === "true"
})
export default withBundleAnalyzer(config);
