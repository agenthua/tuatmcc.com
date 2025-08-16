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

const workshops = defineCollection({
  loader: github("**/*.md", "./content/workshops"),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().optional(),
    authors: z.string().array().optional(),
  }),
});

export const collections = { posts, workshops };
