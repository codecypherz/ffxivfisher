
goog.provide('ff.model.Area');

goog.require('ff.model.Region');
goog.provide('ff.model.AreaEnum');



/**
 * @param {!ff.model.Region} region
 * @param {string} name
 * @constructor
 */
ff.model.Area = function(region, name) {

  /** @private {!ff.model.Region} */
  this.region_ = region;

  /** @private {string} */
  this.name_ = name;
};


/** @return {!ff.model.Region} */
ff.model.Area.prototype.getRegion = function() {
  return this.region_;
};


/** @return {string} */
ff.model.Area.prototype.getName = function() {
  return this.name_;
};


/**
 * @enum {!ff.model.Area}
 */
ff.model.AreaEnum = {
  LIMSA_LOMINSA_UPPER_DECKS: new ff.model.Area(
      ff.model.Region.LA_NOSCEA, 'Limsa Lominsa Upper Decks'),
  MIDDLE_LA_NOSCEA: new ff.model.Area(
      ff.model.Region.LA_NOSCEA, 'Middle La Noscea')
};
