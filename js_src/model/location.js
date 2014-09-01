
goog.provide('ff.model.Location');

goog.require('ff.model.AreaEnum');
goog.provide('ff.model.LocationEnum');



/**
 * @param {!ff.model.Area} area
 * @param {string} name
 * @constructor
 */
ff.model.Location = function(area, name) {

  /** @private {!ff.model.Area} */
  this.area_ = area;

  /** @private {string} */
  this.name_ = name;
};


/** @return {!ff.model.Area} */
ff.model.Location.prototype.getArea = function() {
  return this.area_;
};


/** @return {string} */
ff.model.Location.prototype.getName = function() {
  return this.name_;
};


/**
 * @enum {!ff.model.Location}
 */
ff.model.LocationEnum = {
  LIMSA_LOMINSA_UPPER_DECKS: new ff.model.Location(
      ff.model.AreaEnum.LIMSA_LOMINSA_UPPER_DECKS, 'Limsa Lominsa Upper Decks'),
  NYM_RIVER: new ff.model.Location(
      ff.model.AreaEnum.MIDDLE_LA_NOSCEA, 'Nym River'),
  SUMMERFORD: new ff.model.Location(
      ff.model.AreaEnum.MIDDLE_LA_NOSCEA, 'Summerford')
};
