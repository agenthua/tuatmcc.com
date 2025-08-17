// src/pages/posts/[slug]/og-image.png.ts
import { getCollection, getEntry } from "astro:content";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { OgImage } from "@components/react/OgImage";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import type { APIRoute } from "astro";
import { createElement } from "react";
import satori from "satori";

export const prerender = true; // ← 明示しておく

const require = createRequire(import.meta.url);
let wasmReady: Promise<void> | null = null;
function ensureWasm() {
  if (!wasmReady) {
    wasmReady = (async () => {
      // node_modules 内の実ファイルを解決して読み込む（HTTP fetchしない）
      const wasmPath = require.resolve("@resvg/resvg-wasm/index_bg.wasm");
      const buf = await readFile(wasmPath);
      await initWasm(new Uint8Array(buf));
    })();
  }
  return wasmReady;
}

export const GET: APIRoute = async ({ params }) => {
  await ensureWasm();

  const { slug } = params;
  if (!slug) return new Response("Not found", { status: 404 });

  const post = await getEntry("posts", slug);
  if (!post) return new Response("Not found", { status: 404 });

  // フォントはビルド時なので fs でOK
  const font = await readFile("./src/assets/og/ZenKakuGothicNew-Bold.ttf");

  const svg = await satori(
    createElement(OgImage, { title: post.data.title, tags: post.data.tags }),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Zen Kaku Gothic New",
          data: font,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  const png = new Resvg(svg).render().asPng();
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
    status: 200,
  });
};

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((post) => ({ params: { slug: post.id } }));
}
