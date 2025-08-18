import type { CollectionEntry } from "astro:content";
import { readFile } from "node:fs/promises";
import { OgImage } from "@components/react/OgImage";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import RESVG_WASM from "@resvg/resvg-wasm/index_bg.wasm";
import { createElement } from "react";
import satori from "satori";

await initWasm(RESVG_WASM);

export const generateOgImage = async (
  post: CollectionEntry<"posts">,
): Promise<Uint8Array> => {
  // フォントはビルド時なので fs でOK
  const font = await readFile("./src/assets/og/ZenKakuGothicNew-Bold.ttf");

  const svg = await satori(createElement(OgImage, { title: post.data.title }), {
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
  });

  const png = new Resvg(svg).render().asPng();
  return png;
};
