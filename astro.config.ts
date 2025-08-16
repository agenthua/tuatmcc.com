import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import remarkNormalizeHeadings from "remark-normalize-headings";
import remarkToc from "remark-toc";

// https://astro.build/config
export default defineConfig({
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
  site: "https://tuatmcc.com",
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
});
