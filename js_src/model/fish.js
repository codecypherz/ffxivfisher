
goog.provide('ff.model.Fish');

goog.require('ff');
goog.require('ff.model.Weather');
goog.require('goog.array');
goog.require('goog.events.EventTarget');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.structs');
goog.require('goog.structs.Set');



/**
 * The model for a fish.
 * @param {string} key
 * @param {string} name
 * @param {!goog.structs.Set} weatherSet
 * @param {number} startHour
 * @param {number} endHour
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ff.model.Fish = function(key, name, weatherSet, startHour, endHour) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.model.Fish');

  /** @private {string} */
  this.key_ = key;

  /** @private {string} */
  this.name_ = name;

  /** @private {!goog.structs.Set} */
  this.weatherSet_ = weatherSet;

  /** @private {number} */
  this.startHour_ = startHour;

  /** @private {number} */
  this.endHour_ = endHour;

  /** @private {boolean} */
  this.catchable_ = false;
};
goog.inherits(ff.model.Fish, goog.events.EventTarget);


/**
 * The events dispatched by this object.
 * @enum {string}
 */
ff.model.Fish.EventType = {
  CATCHABLE_CHANGED: ff.getUniqueId('catchable-changed')
};


/** @return {string} */
ff.model.Fish.prototype.getKey = function() {
  return this.key_;
};


/** @return {string} */
ff.model.Fish.prototype.getName = function() {
  return this.name_;
};


/** @return {!goog.structs.Set} */
ff.model.Fish.prototype.getWeatherSet = function() {
  return this.weatherSet_;
};


/** @return {number} */
ff.model.Fish.prototype.getStartHour = function() {
  return this.startHour_;
};


/** @return {number} */
ff.model.Fish.prototype.getEndHour = function() {
  return this.endHour_;
};


/** @return {boolean} */
ff.model.Fish.prototype.isCatchable = function() {
  return this.catchable_;
};


/** @param {boolean} catchable */
ff.model.Fish.prototype.setCatchable = function(catchable) {
  var oldCatchable = this.catchable_;
  this.catchable_ = catchable;
  if (oldCatchable != catchable) {
    this.dispatchEvent(ff.model.Fish.EventType.CATCHABLE_CHANGED);
  }
};


/**
 * Gets the URL for the fish image.
 * @return {string}
 */
ff.model.Fish.prototype.getImageUrl = function() {
  return '/images/fish/' + this.name_.replace(/\s/, '_').toLowerCase() + '.png';
};


/**
 * Converts the fish to JSON.
 * @return {!Object}
 */
ff.model.Fish.prototype.toJson = function() {
  var transposedWeather = goog.object.transpose(ff.model.Weather);
  var weatherArray = [];
  goog.structs.forEach(this.weatherSet_, function(weather) {
    weatherArray.push(transposedWeather[weather]);
  });

  return {
    'key': this.key_,
    'name': this.name_,
    'weatherSet': weatherArray,
    'startHour': this.startHour_,
    'endHour': this.endHour_
  };
};


/**
 * @param {!Object} json The JSON for a fish object.
 * @return {!ff.model.Fish} The parsed fish model.
 */
ff.model.Fish.fromJson = function(json) {

  var weatherSet = new goog.structs.Set();
  goog.array.forEach(json['weatherSet'], function(weatherString) {
    var weather = ff.stringKeyToEnum(weatherString, ff.model.Weather);
    if (goog.isDefAndNotNull(weather)) {
      weatherSet.add(weather);
    } else {
      throw Error('Unknown weather: ' + weatherString);
    }
  });

  return new ff.model.Fish(
      json['key'],
      json['name'],
      weatherSet,
      json['startHour'],
      json['endHour']);
};
