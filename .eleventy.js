const pluginPWA = require("eleventy-plugin-pwa");
const cleanCSS = require("clean-css");
const pluginSEO = require("eleventy-plugin-seo");


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