goog.provide('ff.model.Image');


/**
 * @param {string} subPath The sub path of the URL (e.g. tackle).
 * @param {string} name The unmodified name of the image (e.g. name of fish).
 * @return {string} The name of the image.
 */
ff.model.Image.getUrl = function(subPath, name) {
  var imageName = name
      .replace(/\s/g, '_')
      .replace(/\'/g, '')
      .toLowerCase();
  return '/images/' + subPath + '/' + imageName + '.png';
};
