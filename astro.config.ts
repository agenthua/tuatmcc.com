export const prernder = true;

import cloudflare from "@astrojs/cloudflare";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField, fontProviders } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import remarkNormalizeHeadings from "remark-normalize-headings";
import remarkToc from "remark-toc";

// https://astro.build/config
export default defineConfig({
  site: "https://tuatmcc.com",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react({
      include: ["**/react/**"],
    }),
    icon(),
    partytown(),
    expressiveCode({
      themes: ["github-light", "github-dark"],
    }),
  ],
  markdown: {
    gfm: true,
    remarkPlugins: [remarkToc, remarkNormalizeHeadings],
  },
  env: {
    schema: {
      GOOGLE_ANALYTICS_ID: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
  image: {
    layout: "constrained",
  },
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Orbitron",
        weights: ["500", "700"], // medium, bold
        cssVariable: "--font-family-orbitron",
      },
    ],
  },
});
