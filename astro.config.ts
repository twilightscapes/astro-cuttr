import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import fs from "fs";
import rehypeExternalLinks from "rehype-external-links";
import remarkUnwrapImages from "remark-unwrap-images";

import { expressiveCodeOptions } from "./src/site.config";
import { remarkReadingTime } from "./src/utils/remark-reading-time";
import AstroPWA from '@vite-pwa/astro'
// https://astro.build/config
export default defineConfig({
	image: {
		domains: ["webmention.io"],
	},
	integrations: [
		expressiveCode(expressiveCodeOptions),
		icon(),
		tailwind({
			applyBaseStyles: false,
		}),
		sitemap(),
		mdx(),
		react(),
		AstroPWA({
			mode: 'development',
			base: '/',
			scope: '/',
			includeAssets: ['favicon.svg'],
			registerType: 'autoUpdate',
			manifest: {
			  name: 'Cuttr',
			  short_name: 'Cuttr',
			  theme_color: 'hsl(133, 47%, 54%)',
			  display: 'standalone',
			  start_url: '/map',
			  icons: [
				{
				  src: '192x192.png',
				  sizes: '192x192',
				  type: 'image/png',
				},
				{
				  src: '512x512.png',
				  sizes: '512x512',
				  type: 'image/png',
				},
				{
				  src: '512x512.png',
				  sizes: '512x512',
				  type: 'image/png',
				  purpose: 'any maskable',
				},
			  ],
			},
			workbox: {
			  navigateFallback: '/',
			  globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
			},
			devOptions: {
			  enabled: true,
			  navigateFallbackAllowlist: [/^\//],
			},
			experimental: {
			  directoryAndTrailingSlashHandler: true,
			}
		  }),
	],
	markdown: {
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					rel: ["nofollow, noopener, noreferrer"],
					target: "_blank",
				},
			],
		],
		remarkPlugins: [remarkUnwrapImages, remarkReadingTime],
		remarkRehype: {
			footnoteLabelProperties: {
				className: [""],
			},
		},
	},
	// https://docs.astro.build/en/guides/prefetch/
	prefetch: true,
	// ! Please remember to replace the following site property with your own domain
	site: "https://cuttr.app",
	vite: {
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
		plugins: [rawFonts([".ttf", ".woff"])],
	},
});

function rawFonts(ext: string[]) {
	return {
		name: "vite-plugin-raw-fonts",
		// @ts-expect-error:next-line
		transform(_, id) {
			// eslint-disable-next-line
			if (ext.some((e) => id.endsWith(e))) {
				// eslint-disable-next-line
				const buffer = fs.readFileSync(id);
				return {
					code: `export default ${JSON.stringify(buffer)}`,
					map: null,
				};
			}
		},
	};
}
