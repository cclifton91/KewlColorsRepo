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
	config.addNunjucksAsyncShortcode("responsiveimg", async function (src, alt, options) {
		if (alt === undefined) {
			// You bet we throw an error on missing alt (alt="" works okay)
			throw new Error(`Missing \`alt\` on responsiveimg from: ${src}`);
		}

		let stats = await Image(src, {
			widths: [null],
			formats: ["webp", "jpg", "png"],
			urlPath: "/assets/img",
			outputDir: "./_site/assets/img",
			...options
		});
		let lowestSrc = stats.jpg[0];
		let sizes = "(min-width: 64rem) 80vw,(min - width: 48rem) 90vw, 100vw "; // Make sure you customize this!

		// Iterate over formats and widths
		return `<picture>
      ${Object.values(stats).map(imageFormat => {
        return `  <source type="image/${imageFormat[0].format}" srcset="${imageFormat.map(entry => `${entry.url} ${entry.width}w`).join(", ")}" sizes="${sizes}">`;
      }).join("\n")}
        <img
          src="${lowestSrc.url}"
          width="${lowestSrc.width}"
          height="${lowestSrc.height}"
          alt="${alt}">
      </picture>`;
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