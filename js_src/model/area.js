
goog.provide('ff.model.Area');

goog.require('ff.model.Region');
goog.require('goog.object');
goog.require('goog.string');
goog.provide('ff.model.AreaEnum');



/**
 * @param {number} clientIdentifier
 * @param {!ff.model.Region} region
 * @param {string} name
 * @constructor
 */
ff.model.Area = function(clientIdentifier, region, name) {

  /** @private {number} */
  this.clientIdentifier_ = clientIdentifier;

  /** @private {!ff.model.Region} */
  this.region_ = region;

  /** @private {string} */
  this.name_ = name;
};


/** @return {number} */
ff.model.Area.prototype.getClientIdentifier = function() {
  return this.clientIdentifier_;
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
 * Figures out the enum given the model.
 * @param {!ff.model.Area} area
 * @return {string}
 */
ff.model.Area.getEnum = function(area) {
  var key = goog.object.findKey(
      ff.model.AreaEnum,
      function(value, key, object) {
        return goog.string.caseInsensitiveCompare(
            value.getName(), area.getName()) == 0;
      });
  if (!key) {
    throw Error('Unable to find AreaEnum for ' + area.getName());
  }
  return key;
};


/**
 * Figures out the enum given the identifier.
 * @param {number} identifier
 * @return {string}
 */
ff.model.Area.getEnumFromIdentifier = function(identifier) {
  var key = goog.object.findKey(
      ff.model.AreaEnum,
      function(value, key, object) {
        return value.getClientIdentifier() == identifier;
      });
  if (!key) {
    throw Error('Unable to find AreaEnum for identifier ' + identifier);
  }
  return key;
};


/**
 * @enum {!ff.model.Area}
 */
ff.model.AreaEnum = {
  // La Noscea
  'LIMSA_LOMINSA_UPPER_DECKS': new ff.model.Area(
      0, ff.model.Region.LA_NOSCEA, 'Limsa Lominsa Upper Decks'),
  'LIMSA_LOMINSA_LOWER_DECKS': new ff.model.Area(
      1, ff.model.Region.LA_NOSCEA, 'Limsa Lominsa Lower Decks'),
  'MIDDLE_LA_NOSCEA': new ff.model.Area(
      2, ff.model.Region.LA_NOSCEA, 'Middle La Noscea'),
  'LOWER_LA_NOSCEA': new ff.model.Area(
      3, ff.model.Region.LA_NOSCEA, 'Lower La Noscea'),
  'EASTERN_LA_NOSCEA': new ff.model.Area(
      4, ff.model.Region.LA_NOSCEA, 'Eastern La Noscea'),
  'WESTERN_LA_NOSCEA': new ff.model.Area(
      5, ff.model.Region.LA_NOSCEA, 'Western La Noscea'),
  'UPPER_LA_NOSCEA': new ff.model.Area(
      6, ff.model.Region.LA_NOSCEA, 'Upper La Noscea'),
  'OUTER_LA_NOSCEA': new ff.model.Area(
      7, ff.model.Region.LA_NOSCEA, 'Outer La Noscea'),
  'MIST': new ff.model.Area(
      8, ff.model.Region.LA_NOSCEA, 'Mist'),

  // The Black Shroud
  'NEW_GRIDANIA': new ff.model.Area(
      9, ff.model.Region.THE_BLACK_SHROUD, 'New Gridania'),
  'OLD_GRIDANIA': new ff.model.Area(
      10, ff.model.Region.THE_BLACK_SHROUD, 'Old Gridania'),
  'CENTRAL_SHROUD': new ff.model.Area(
      11, ff.model.Region.THE_BLACK_SHROUD, 'Central Shroud'),
  'EAST_SHROUD': new ff.model.Area(
      12, ff.model.Region.THE_BLACK_SHROUD, 'East Shroud'),
  'SOUTH_SHROUD': new ff.model.Area(
      13, ff.model.Region.THE_BLACK_SHROUD, 'South Shroud'),
  'NORTH_SHROUD': new ff.model.Area(
      14, ff.model.Region.THE_BLACK_SHROUD, 'North Shroud'),
  'LAVENDER_BEDS': new ff.model.Area(
      15, ff.model.Region.THE_BLACK_SHROUD, 'Lavender Beds'),

  // Thanalan
  'WESTERN_THANALAN': new ff.model.Area(
      16, ff.model.Region.THANALAN, 'Western Thanalan'),
  'CENTRAL_THANALAN': new ff.model.Area(
      17, ff.model.Region.THANALAN, 'Central Thanalan'),
  'EASTERN_THANALAN': new ff.model.Area(
      18, ff.model.Region.THANALAN, 'Eastern Thanalan'),
  'SOUTHERN_THANALAN': new ff.model.Area(
      19, ff.model.Region.THANALAN, 'Southern Thanalan'),
  'NORTHERN_THANALAN': new ff.model.Area(
      20, ff.model.Region.THANALAN, 'Northern Thanalan'),
  'THE_GOBLET': new ff.model.Area(
      21, ff.model.Region.THANALAN, 'The Goblet'),

  // Coerthas
  'COERTHAS_CENTRAL_HIGHLANDS': new ff.model.Area(
      22, ff.model.Region.COERTHAS, 'Coerthas Central Highlands'),

  // Mor Dhona
  'MOR_DHONA': new ff.model.Area(
      23, ff.model.Region.MOR_DHONA, 'Mor Dhona')
};
