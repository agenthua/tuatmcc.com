import { defineCollection, z } from "astro:content";
import { github } from "./loaders/github";

const posts = defineCollection({
  loader: github("**/index.md", "./content/posts"),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().optional(),
    authors: z.string().array().optional(),
    draft: z.boolean().optional(),
    tags: z.string().array().optional(),
  }),
});

const workshopCovers = defineCollection({
  loader: github("*/index.md", "./content/workshops"),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean().optional(),
    author: z.string().optional(),
    authors: z.string().array().optional(),
    firstSlug: z.string().optional(),
  }),
});

const workshopPages = defineCollection({
  loader: github(["*/*.md", "!*/index.md"], "./content/workshops"),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = {
  posts,
  workshopCovers,
  workshopPages,
};
