import { getCollection, getEntry } from "astro:content";
import { readFile } from "node:fs/promises";
import { OgImage } from "@components/react/OgImage";
import { Resvg } from "@resvg/resvg-js";
import type { APIRoute } from "astro";
import { createElement } from "react";
import satori from "satori";

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;
  if (slug == null) {
    return new Response("Not found", { status: 404 });
  }

  const post = await getEntry("posts", slug);
  if (post == null) {
    return new Response("Not found", { status: 404 });
  }

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

  return posts.map((post) => ({
    params: { slug: post.id },
  }));
}
