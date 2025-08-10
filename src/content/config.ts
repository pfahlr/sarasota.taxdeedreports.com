// src/content/config.ts
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    draft: z.boolean().optional(),
    image: z.string().optional(),
    image_alt: z.string().optional()
  })
});

console.log('content config');
console.log(blog);
export const collections = {
  blog,
};
