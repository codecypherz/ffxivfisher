
goog.provide('ff.model.Mooch');

goog.require('ff.model.CatchPathPart');
goog.require('ff.model.Image');



/**
 * @param {string} fishName
 * @constructor
 * @implements {ff.model.CatchPathPart}
 */
ff.model.Mooch = function(fishName) {

  /** @private {string} */
  this.fishName_ = fishName;
};


/** @override */
ff.model.Mooch.prototype.getName = function() {
  return this.fishName_;
};


/** @override */
ff.model.Mooch.prototype.getImageUrl = function() {
  return ff.model.Image.getUrl('fish', this.fishName_);
};


/**
 * Converts the fish to JSON.
 * @return {!Object}
 */
ff.model.Mooch.prototype.toJson = function() {
  return {
    'fishName': this.fishName_
  };
};
