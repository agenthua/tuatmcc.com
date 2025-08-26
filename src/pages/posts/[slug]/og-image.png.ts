import { getCollection, getEntry } from "astro:content";
import { generateOgImage } from "@libs/generateOgImage";
import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;
  if (!slug) return new Response("Not found", { status: 404 });

  const post = await getEntry("posts", slug);
  if (!post) return new Response("Not found", { status: 404 });

  const png = await generateOgImage(post);

  return new Response(Buffer.from(png), {
    headers: { "Content-Type": "image/png" },
  });
};

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((post) => ({ params: { slug: post.id } }));
}
