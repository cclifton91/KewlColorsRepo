const pluginPWA = require("eleventy-plugin-pwa");
const cleanCSS = require("clean-css");
const pluginSEO = require("eleventy-plugin-seo");
const util = require('util');

module.exports = function (config) {
	/** PLUGINS **/
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
	//SEO
	config.addPlugin(pluginSEO, require("./src/_data/seo.json"));
	
	/** COLECTIONS **/
	//Adds data dump functionality
	config.addFilter("dump", (obj) => {
		return util.inspect(obj);
	});
	// Returns a collection of blog products in reverse date order
	config.addCollection("products", (collection) => {
		return [...collection.getFilteredByGlob("./src/products/*.md")];
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
};