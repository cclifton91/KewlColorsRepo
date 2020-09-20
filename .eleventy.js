const pluginPWA = require("eleventy-plugin-pwa");
const cleanCSS = require("clean-css");
const pluginSEO = require("eleventy-plugin-seo");
const pluginLocalRespimg = require("eleventy-plugin-local-respimg");
const util = require('util');


module.exports = function (config) {
	/** PLUGINS **/
	//pwa
	config.addPlugin(pluginPWA, {
		swDest: "./_site/service-worker.js",
		globDirectory: "./_site",
		clientsClaim: true,
		skipWaiting: true,
	});
	//cssmin
	config.addFilter("cssmin", function (code) {
		return new cleanCSS({}).minify(code).styles;
	});
	//seo
	config.addPlugin(pluginSEO, require("./src/_data/seo.json"));
	//data dump filter
	config.addFilter("dump", (obj) => {
		return util.inspect(obj);
	});
	//11ty img
	config.addPlugin(pluginLocalRespimg, {
		folders: {
			source: "src", // Folder images are stored in
			output: "_site", // Folder images should be output to
		},
		images: {
			resize: {
				min: 300, // Minimum width to resize an image to
				max: 1500, // Maximum width to resize an image to
				step: 300, // Width difference between each resized image
			},
			gifToVideo: false, // Convert GIFs to MP4 videos
			sizes: "100vw", // Default image `sizes` attribute
			lazy: true, // Include `loading="lazy"` attribute for images
			additional: [
				// Globs of additional images to optimize (won't be resized)
				"/_assets/icons/**/*",
			],
			watch: {
				src: "/_assets/img/**/*", // Glob of images that Eleventy should watch for changes to
			},
			pngquant: {
				/* ... */
			}, // imagemin-pngquant options
			mozjpeg: {
				/* ... */
			}, // imagemin-mozjpeg options
			svgo: {
				/* ... */
			}, // imagemin-svgo options
			gifresize: {
				/* ... */
			}, // @gumlet/gif-resize options
			webp: {
				/* ... */
			}, // imagemin-webp options
			gifwebp: {
				/* ... */
			}, // imagemin-gif2webp options
		},
	});
	

	/** COLECTIONS **/

	// Returns a collection of blog products in reverse date order
	config.addCollection("products", (collection) => {
		return [...collection.getFilteredByGlob("./src/products/*.md")];
	});
	// Returns a collection of tags
	config.addCollection("tags", (collection) => {
		let tags = new Set();

		collection.getAll().forEach((item) => {
			if ("tags" in item.data) {
				for (const tag of item.data.tags) {
					tags.add(tag);
				}
			}
		});

		return [...tags];
	});
	// Returns the products collection but filters out all those that have featured set to true
	config.addCollection("bestseller", (collection) => {
		return collection
			.getFilteredByGlob("./src/products/*.md")
			.filter((x) => x.data.bestseller)
			.slice(0, 3);
	});

	/** ELEVENTY CONFIG **/
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
}