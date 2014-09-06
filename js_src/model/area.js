
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
  // La Noscea
  'LIMSA_LOMINSA_UPPER_DECKS': new ff.model.Area(
      ff.model.Region.LA_NOSCEA, 'Limsa Lominsa Upper Decks'),
  'LIMSA_LOMINSA_LOWER_DECKS': new ff.model.Area(
      ff.model.Region.LA_NOSCEA, 'Limsa Lominsa Lower Decks'),
  'MIDDLE_LA_NOSCEA': new ff.model.Area(
      ff.model.Region.LA_NOSCEA, 'Middle La Noscea'),
  'LOWER_LA_NOSCEA': new ff.model.Area(
      ff.model.Region.LA_NOSCEA, 'Lower La Noscea'),
  'EASTERN_LA_NOSCEA': new ff.model.Area(
      ff.model.Region.LA_NOSCEA, 'Eastern La Noscea'),
  'WESTERN_LA_NOSCEA': new ff.model.Area(
      ff.model.Region.LA_NOSCEA, 'Western La Noscea'),
  'UPPER_LA_NOSCEA': new ff.model.Area(
      ff.model.Region.LA_NOSCEA, 'Upper La Noscea'),
  'OUTER_LA_NOSCEA': new ff.model.Area(
      ff.model.Region.LA_NOSCEA, 'Outer La Noscea'),
  'MIST': new ff.model.Area(
      ff.model.Region.LA_NOSCEA, 'Mist'),

  // The Black Shroud
  'NEW_GRIDANIA': new ff.model.Area(
      ff.model.Region.THE_BLACK_SHROUD, 'New Gridania'),
  'OLD_GRIDANIA': new ff.model.Area(
      ff.model.Region.THE_BLACK_SHROUD, 'Old Gridania'),
  'CENTRAL_SHROUD': new ff.model.Area(
      ff.model.Region.THE_BLACK_SHROUD, 'Centra Shroud'),
  'EAST_SHROUD': new ff.model.Area(
      ff.model.Region.THE_BLACK_SHROUD, 'East Shroud'),
  'SOUTH_SHROUD': new ff.model.Area(
      ff.model.Region.THE_BLACK_SHROUD, 'South Shroud'),
  'NORTH_SHROUD': new ff.model.Area(
      ff.model.Region.THE_BLACK_SHROUD, 'North Shroud'),
  'LAVENDER_BEDS': new ff.model.Area(
      ff.model.Region.THE_BLACK_SHROUD, 'Lavender Beds'),

  // Thanalan
  'WESTERN_THANALAN': new ff.model.Area(
      ff.model.Region.THANALAN, 'Western Thanalan'),
  'CENTRAL_THANALAN': new ff.model.Area(
      ff.model.Region.THANALAN, 'Central Thanalan'),
  'EASTERN_THANALAN': new ff.model.Area(
      ff.model.Region.THANALAN, 'Eastern Thanalan'),
  'SOUTHERN_THANALAN': new ff.model.Area(
      ff.model.Region.THANALAN, 'Southern Thanalan'),
  'NORTHERN_THANALAN': new ff.model.Area(
      ff.model.Region.THANALAN, 'Northern Thanalan'),
  'THE_GOBLET': new ff.model.Area(
      ff.model.Region.THANALAN, 'The Goblet'),

  // Coerthas
  'COERTHAS_CENTRAL_HIGHLANDS': new ff.model.Area(
      ff.model.Region.COERTHAS, 'Coerthas Central Highlands'),

  // Mor Dhona
  'MOR_DHONA': new ff.model.Area(
      ff.model.Region.MOR_DHONA, 'Mor Dhona')
};
