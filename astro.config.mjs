import { defineConfig } from 'astro/config'
import remarkDirective from 'remark-directive';
import remarkFaqAside from './remark-faq-aside.js';
import tailwindcss from '@tailwindcss/vite'
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://taxdeedreports.com',
  integrations: [sitemap()],
  adapter:cloudflare(),
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    remarkPlugins: [
      remarkDirective,
      remarkFaqAside
    ]
  },
  experimental: {
    fonts: [{
      provider: "local",
      name: "InterLocal",
      cssVariable: "--font-inter",
      variants: [
        {
          weight: 400,
          style: "normal",
          src: ["./src/assets/fonts/Inter-Regular.woff2"]
        },
        {
          weight: 600,
          style: "normal",
          src: ["./src/assets/fonts/Inter-SemiBold.woff2"]
        },
        {
          weight: 700,
          style: "normal",
          src: ["./src/assets/fonts/Inter-Bold.woff2"]
        }
      ]
    },
    {
      provider: "local",
      name: "InterLocalDisplay",
      cssVariable: "--font-inter-display",
      variants: [
        {
          weight: 400,
          style: "normal",
          src: ["./src/assets/fonts/InterDisplay-Regular.woff2"]
        },
        {
          weight: 500,
          style: "normal",
          src: ["./src/assets/fonts/InterDisplay-Medium.woff2"]
        },
        {
          weight: 600,
          style: "normal",
          src: ["./src/assets/fonts/InterDisplay-SemiBold.woff2"]
        }
      ]
    }]
  }
})
