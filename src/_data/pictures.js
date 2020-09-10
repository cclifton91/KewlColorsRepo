module.exports = (url, alt = "Missing alt text") => {
    return `<picture loading="lazy">
  <source data-srcset="/assets/img/${url}?nf_resize=fit&w=700" media="(min-width: 1200px)">
  <source data-srcset="/assets/img/${url}?nf_resize=fit&w=600" media="(min-width: 740px)">
  <img data-src="/assets/img/${url}?nf_resize=fit&w=320" alt="${alt}" />
</picture>`;
};
