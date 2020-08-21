const pluginPWA = require("eleventy-plugin-pwa");
const cleanCSS = require("clean-css");
const responsivePicturePlugin = require("eleventy-plugin-responsive-picture");
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
	//Responsive Picture
	config.addPlugin(responsivePicturePlugin, {
		ratios: [2, 1],
		sources: [{
				media: "(min-width: 1024px)",
				size: 824
			},
			{
				media: "(min-width: 768px)",
				size: 696
			},
			{
				media: "(min-width: 420px)",
				size: 568
			},
			{
				size: 348
			},
		],
		fallback: (src) => `${src}?w=1000`,
		resize: (src, width) => `${src}?w=${size}`,
	});
	//SEO
	config.addPlugin(pluginSEO, {
		title: "Kewl Colors",
		description: "Hand painted, custom made accessories",
		url: "https://kewlcolors.com",
		author: "Kari Wilson",
		tiwtter: "kariwlison",
		image: "./assets/images/32.png",
		ogtype: "website",
	});

	/**Eleventy Configuration **/
	config.addPassthroughCopy("manifest.json");
	config.addPassthroughCopy("./assets/images");
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