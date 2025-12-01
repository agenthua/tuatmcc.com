import { defineCollection, z } from "astro:content";
import { github } from "./loaders/github";

// Custom ID generator that strips parent directory prefix (posts/ or blog/)
// and converts "folder/index" to just "folder"
function generatePostId({
  entry,
}: {
  entry: string;
  base: URL;
  data: Record<string, unknown>;
}): string {
  // entry is like "posts/2024-01-26-ascii-table/index" or "blog/mcc-adventcalendar/index"
  // We want just the folder name, e.g., "2024-01-26-ascii-table" or "mcc-adventcalendar"
  const parts = entry.split("/");
  // Remove parent directory (posts/ or blog/) and filename (index)
  // Result: just the article folder name
  if (parts.length >= 3) {
    // e.g., ["posts", "2024-01-26-ascii-table", "index"] -> "2024-01-26-ascii-table"
    return parts.slice(1, -1).join("/");
  }
  // Fallback: return original entry if unexpected format
  return entry;
}

const posts = defineCollection({
  loader: github({
    pattern: [
      "posts/**/index.md",
      "blog/**/index.md",
      "!blog/picogym-exclusive/**", // duplicate of posts/2024-05-26-picogym-exclusive
    ],
    base: "./content",
    generateId: generatePostId,
  }),
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
