const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  // Enable YAML data files (.yaml)
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy("assets");

  // Filter: limit array length
  eleventyConfig.addFilter("limit", (arr, limit) =>
    Array.isArray(arr) ? arr.slice(0, limit) : []
  );

  // Filter: sort by date field descending
  eleventyConfig.addFilter("sortByDate", (arr) => {
    if (!Array.isArray(arr)) return [];
    return [...arr].sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  // Filter: filter active projects
  eleventyConfig.addFilter("active", (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.filter(p => p.active !== false);
  });

  // Filter: filter featured projects
  eleventyConfig.addFilter("featured", (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.filter(p => p.featured === true);
  });

  // Filter: people collection entries with a given role, sorted by `order` then name
  eleventyConfig.addFilter("byRole", (coll, role) => {
    return (coll || [])
      .filter(p => p.data.role === role)
      .sort((a, b) =>
        ((a.data.order ?? 99) - (b.data.order ?? 99)) ||
        a.data.name.localeCompare(b.data.name)
      );
  });

  // Shortcode: current year (footer copyright)
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  // Filter: "Jana Pavlasek" -> "JP" (photo placeholder)
  eleventyConfig.addFilter("initials", (name) => {
    return (name || "").split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  });

  return {
    // GitHub Pages project sites live under /<repo>/ — the deploy workflow
    // sets PATH_PREFIX; locally it defaults to "/".
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: {
      input: "src",
      includes: "../_includes",
      data: "../_data",
      output: "_site"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
