const pluginPWA = require("eleventy-plugin-pwa");
const cleanCSS = require("clean-css");
const pluginSEO = require("eleventy-plugin-seo");
const Image = require("@11ty/eleventy-img");

module.exports = function (config) {
	/**Plugins **/
	//PWA
	config.addPlugin(pluginPWA, {
		swDest: "./_site/service-worker.js",
		globDirectory: "./_site",
		clientsClaim: true,
		skipWaiting: true,
	});
	//CSSMIN
	config.addFilter("cssmin", function (code) {
		return new cleanCSS({}).minify(code).styles;
	});
	//Responsive Image
	async function optimImg(src, opts) {
		const finalOpts = {
			widths: [320, 640, 768, 1024, 1366, 1600, 1920],
			formats: ["webp","png", "jpg"],
			urlPath: "/assets/img",
			outputDir: "./_site/assets/img",
			...opts,
		};
		let stats = await Image(src, finalOpts);
		if (finalOpts.widths.length > 1) return stats;
		else return stats["jpg"].pop();
	}
	config.addNunjucksAsyncShortcode("image", async function (src, alt, options) {
		if (alt === undefined) {
			throw new Error(`Missing \`alt\` on resImage from: ${src}`);
		}

		let stats = await optimImg(src);
		let lowestSrc = stats.jpg[0];
		let sizes = "100vw, (min-width: 39.5rem) 608px";

		// Iterate over formats and widths
		return `<picture>
			${Object.values(stats)
				.map((imageFormat) => {
				return `  <source type="image/${imageFormat[0].format}" srcset="${imageFormat
					.map((entry) => `${entry.url} ${entry.width}w`)
					.join(", ")}" sizes="${sizes}">`;
				})
				.join("\n")}
				<img
				alt="${alt}"
				src="${lowestSrc.url}"
				width="${lowestSrc.width}"
				height="${lowestSrc.height}"
				loading="lazy">
      </picture>`;
	});
	config.addNunjucksAsyncShortcode("figure", async function (src, alt, caption, options) {
		if (alt === undefined) {
			throw new Error(`Missing \`alt\` on resImage from: ${src}`);
		}

		let stats = await optimImg(src);
		let lowestSrc = stats.jpg[0];
		let sizes = "100vw";

		// Iterate over formats and widths
		return `<figure><picture>
      ${Object.values(stats)
        .map((imageFormat) => {
          return `  <source type="image/${imageFormat[0].format}" srcset="${imageFormat
            .map((entry) => `${entry.url} ${entry.width}w`)
            .join(", ")}" sizes="${sizes}">`;
        })
        .join("\n")}
        <img
          alt="${alt}"
          src="${lowestSrc.url}"
          width="${lowestSrc.width}"
          height="${lowestSrc.height}"
          loading="lazy">
      </picture><figcaption>${caption}</figcaption></figure>`;
	});
	
	//SEO
	config.addPlugin(pluginSEO, require("./src/_data/seo.json"));

	/**Eleventy Configuration **/
	config.addPassthroughCopy("manifest.json");
	config.addPassthroughCopy({ "src/_assets/img": "assets/img" });
	config.addPassthroughCopy({ "src/_assets/icons": "assets/icons" });
	config.addPassthroughCopy("style-guide");
	config.addPassthroughCopy("admin");
	return {
		passthroughFileCopy: true,
		markdownTemplateEngine: "njk",
		templateFormats: ["html", "njk", "md"],
		dir: {
			input: "src",
			output: "_site",
			include: "_includes",
		},
	};
};