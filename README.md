# sarasota.taxdeedreports.com -- built using blackspike astro landing page

## Dev notes

### Cloudflare pages deploy.

It used to be that in order to deploy changes to your cloudflare pages site, you would commit your changes to a github repository that you had specified when setting up the cloudflare pages site. Now, it is no longer necessary to do either. You can simply setup wrangler to deploy your site to cloudflare pages. The first time you run the `npm run deploy` script, the terminal will try to open a browser window and otherwise provide a link with a token that you can open and login to your cloudflare account and grant the script access to push content to a site (specified in the **"name"** element in `wrangler.jsonc`)

to get `npm run deploy` working with cloudflare pages, it was necessary to create `wrangler.jsonc`:

```javascript
// "/wrangler.jsonc"

{
"$schema": "node_modules/wrangler/config-schema.json",
"name":"sarasota-surplus-funds-leads",
"compatibility_date":"2025-07-22",
"compatibility_flags": ["nodejs_compat"],
"pages_build_output_dir":"./dist",
"observability": {
  "enabled": true
  }
}
```

note: if for some reason you want to change the name of the worker you deploy to, you need to change it here, but there's also a `.cache/wrangler` directory under `node_modules` that stores information relevant to this deployment operation. 

```bash
.
./node_modules/wrangler
./node_modules/wrangler/wrangler-account.json
./node_modules/wrangler/pages.json
```

deleting `pages.json` will force a reset, deleting `wrangler-account.json` I imagine will require you to reauthenticate as it stores a token.

```

and edit `package.json` adding 2 new scripts

```javascript
// "/package.json"

"deploy": "astro build && wrangler deploy",
"cf-typegen": "wrangler types"
```
### Cloudflare pages workers

but in order to get any workers to run, this needs to change to 

```javascript
// "/package.json"

"postbuild": "echo '_worker.js\n_routes.json' > dist/.assetsignore",
"deploy": "npm run build && npx wrangler pages deploy ./dist",
"cf-typegen": "wrangler types"
```

which also adds an `.assetsignore` file under `./dist` 
```bash
# "/dist/.assetsignore"

_worker.js
_routes.json
```

because `astro build` wipes out everything in the `dist` directory and `wrangler deploy` only handles the static assets. 

you must also 
```bash
npm install @astro/cloudflare
```

and update `astro.config.mjs` to have **'adapter':cloudflare()** as a top level element in the object passed to `defineConfig()` like:
```javascript
// "/astro.config.mjs"

export default defineConfig({
  adapter:cloudflare(),
  vite: {
    plugins: [tailwindcss()]
  },
... and so on ...

```


I just started working with server side operations with cloudflare pages, so my understanding of this feature is limited. And I found an alternative solution to the problem I was trying to solve using them before I got it working entirely, but I'm writing down these notes for the next time I encounter an opportunity to use them. 

---

## A free, modern, [Astro](https://astro.build/) landing page theme made with [Tailwind](https://tailwindcss.com/) to help kick start your next Astro project

We built this page as the first version of our own website, [blackspike.com](https://www.blackspike.com), but switched to a different design later. Rather than let it gather dust, we decided to modernise it, try out some fresh new CSS features and give it back to the Astro community. You can read more about how we built it and the cool new tech we used [on our blog post](https://www.blackspike.com/blog/blackspike-free-astro-tailwind-theme/).

[Download it from the Astro themes page](https://astro.build/themes/details/blackspike-astro-landing-page/)

Live demo [https://astro-theme.blackspike.com]

## License

Theme and 3D images are licensed under a [Creative Commons Attribution 4.0 International Public License](https://creativecommons.org/licenses/by/4.0/).

Created by blackspike [blackspike design](https://www.blackspike.com) – a web design & development team specialising in Astro, Vue, Nuxt & Wordpress websites

## Astro 5 Features

- [Image component](https://docs.astro.build/en/guides/images/#display-optimized-images-with-the-image--component) for optimised AVIF images
- All-[JSX](https://docs.astro.build/en/reference/astro-syntax/) native astro components
- SVGs imported as [SVG components](https://docs.astro.build/en/guides/images/#svg-components)
- JSON-powered content (easy to edit UI text or hook up a CMS!)
- Experimental [Fonts API](https://docs.astro.build/en/reference/experimental-flags/fonts/)

## CSS & HTML Features

- [Tailwind 4](https://tailwindcss.com/blog/tailwindcss-v4)
- HTML modal dialog
- JS-free scroll-linked animations
- JS-free exclusive accordions with details/summary (animated!)
- Container queries
- Linear easing for bouncing / springing
- Text wrap pretty / balance

## JS Features

- [swiper.js](https://swiperjs.com/) carousel

## Credits

- Fake logos by [uicontent.co](https://uicontent.co/svg-dummy-logo/)
- Quote avatar person by [thispersondoesnotexist.com](https://thispersondoesnotexist.com/)
- Misc icons and logo from [icones.js.org](https://icones.js.org/) by [@antfu](https://github.com/antfu)
- Carousel powered by [swiperjs.com](https://swiperjs.com/)
- Inter font by [rsms.me](https://rsms.me/inter/)

## Tags

#tailwind #tailwind4 #astro #landingPage #css #html #swiper #dark #theme

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run deploy` 	    | Deploy the site to Cloudflare Pages	       |


