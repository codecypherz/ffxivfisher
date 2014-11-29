
goog.provide('ff.model.Fish');

goog.require('ff');
goog.require('ff.model.CatchPath');
goog.require('ff.model.Image');
goog.require('ff.model.LocationEnum');
goog.require('ff.model.Weather');
goog.require('ff.service.CookieService');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.events.EventTarget');
goog.require('goog.log');
goog.require('goog.math.Range');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.structs');
goog.require('goog.structs.Set');



/**
 * The model for a fish.
 * @param {string} key
 * @param {string} name
 * @param {!goog.structs.Set} previousWeatherSet
 * @param {!goog.structs.Set} weatherSet
 * @param {number} startHour
 * @param {number} endHour
 * @param {!ff.model.Location} fishLocation
 * @param {!ff.model.CatchPath} bestCatchPath
 * @param {string} predator
 * @param {number} predatorCount
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ff.model.Fish = function(
    key,
    name,
    previousWeatherSet,
    weatherSet,
    startHour,
    endHour,
    fishLocation,
    bestCatchPath,
    predator,
    predatorCount) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.model.Fish');

  /** @private {!ff.service.CookieService} */
  this.cookieService_ = ff.service.CookieService.getInstance();

  /** @private {string} */
  this.key_ = key;

  /** @private {string} */
  this.name_ = name;

  /** @private {!goog.structs.Set} */
  this.previousWeatherSet_ = previousWeatherSet;

  /** @private {!goog.structs.Set} */
  this.weatherSet_ = weatherSet;

  /** @private {number} */
  this.startHour_ = startHour;

  /** @private {number} */
  this.endHour_ = endHour;

  /** @private {!ff.model.Location} */
  this.location_ = fishLocation;

  /** @private {!ff.model.CatchPath} */
  this.bestCatchPath_ = bestCatchPath;

  /** @private {!goog.math.Range} */
  this.previousTimeRange_ = new goog.math.Range(0, 0);

  /** @private {!goog.math.Range} */
  this.nextTimeRange_ = new goog.math.Range(0, 0);

  /** @private {!Array.<!goog.math.Range>} */
  this.catchableRanges_ = [];

  /** @private {string} */
  this.predator_ = predator;

  /** @private {number} */
  this.predatorCount_ = predatorCount;
};
goog.inherits(ff.model.Fish, goog.events.EventTarget);


/**
 * The events dispatched by this object.
 * @enum {string}
 */
ff.model.Fish.EventType = {
  CATCHABLE_CHANGED: ff.getUniqueId('catchable-changed'),
  COLOR_CHANGED: ff.getUniqueId('color-changed')
};


/**
 * @enum {string}
 */
ff.model.Fish.Color = {
  ONE: 'ONE',
  TWO: 'TWO',
  THREE: 'THREE',
  CLEAR: 'CLEAR'
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
ff.model.Fish.prototype.getPreviousWeatherSet = function() {
  return this.previousWeatherSet_;
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


/**
 * Figures out how long a fish time range is based on start and end hour.
 * @return {number} The length of the range in hours.
 */
ff.model.Fish.prototype.getRangeLength = function() {
  var diff = Math.abs(this.endHour_ - this.startHour_);
  return this.endHour_ < this.startHour_ ? 24 - diff : diff;
};


/** @return {!ff.model.Location} */
ff.model.Fish.prototype.getLocation = function() {
  return this.location_;
};


/** @return {!ff.model.CatchPath} */
ff.model.Fish.prototype.getBestCatchPath = function() {
  return this.bestCatchPath_;
};


/** @return {!Array.<!goog.math.Range>} */
ff.model.Fish.prototype.getCatchableRanges = function() {
  return this.catchableRanges_;
};


/** @return {boolean} */
ff.model.Fish.prototype.isCatchable = function() {
  return !goog.array.isEmpty(this.catchableRanges_);
};


/** @param {!Array.<!goog.math.Range>} catchableRanges */
ff.model.Fish.prototype.setCatchableRanges = function(catchableRanges) {
  this.catchableRanges_ = catchableRanges;
  this.dispatchEvent(ff.model.Fish.EventType.CATCHABLE_CHANGED);
};


/**
 * Gets the previous time range for catching the fish which may overlap the
 * current time.  This is just to represent the time range for the fish and does
 * not necessarily mean the fish is catchable.
 * @return {!goog.math.Range}
 */
ff.model.Fish.prototype.getPreviousTimeRange = function() {
  return this.previousTimeRange_;
};


/**
 * Gets the next time range for catching the fish which will always be in the
 * future.  This is just to represent the time range for the fish and does not
 * necessarily mean the fish is catchable.
 * @return {!goog.math.Range}
 */
ff.model.Fish.prototype.getNextTimeRange = function() {
  return this.nextTimeRange_;
};


/**
 * Sets the previous and next time ranges for the fish.
 * @param {!goog.math.Range} previous Previous time range for the fish which may
 *     overlap with the current time.
 * @param {!goog.math.Range} next Next time range for the fish which will always
 *     be in the future.
 */
ff.model.Fish.prototype.setTimeRanges = function(previous, next) {
  var intersection = goog.math.Range.intersection(previous, next);
  // Null intersection means no intersection.
  // Length of zero means end of previous runs right into beginning of next.
  goog.asserts.assert(
      goog.isNull(intersection) || intersection.getLength() == 0);
  // Previous must always come before start.
  goog.asserts.assert(previous.start < next.start);
  this.previousTimeRange_ = previous;
  this.nextTimeRange_ = next;
};


/**
 * Gets the URL for the fish image.
 * @return {string}
 */
ff.model.Fish.prototype.getImageUrl = function() {
  return ff.model.Image.getUrl('fish', this.name_);
};


/**
 * Sets the color the user chose for the fish.
 * @param {!ff.model.Fish.Color} color The new color chosen by the user.
 */
ff.model.Fish.prototype.setUserColor = function(color) {
  this.cookieService_.set(this.getUserColorKey_(), color);
  this.dispatchEvent(ff.model.Fish.EventType.COLOR_CHANGED);
};


/**
 * Gets the color the user chose for the fish.
 * @return {!ff.model.Fish.Color}
 */
ff.model.Fish.prototype.getUserColor = function() {
  var colorFromCookie = this.cookieService_.get(
      this.getUserColorKey_(), ff.model.Fish.Color.CLEAR);
  return /** @type {!ff.model.Fish.Color} */ (
      ff.stringValueToEnum(colorFromCookie, ff.model.Fish.Color));
};


/**
 * @return {string}
 */
ff.model.Fish.prototype.getPredator = function() {
  return this.predator_;
};


/**
 * @return {number}
 */
ff.model.Fish.prototype.getPredatorCount = function() {
  return this.predatorCount_;
};


/**
 * @return {string} The key used to set/get color cookies.
 * @private
 */
ff.model.Fish.prototype.getUserColorKey_ = function() {
  return this.key_ + '_user_color';
};


/**
 * Converts the fish to JSON.
 * @return {!Object}
 */
ff.model.Fish.prototype.toJson = function() {
  var transposedWeather = goog.object.transpose(ff.model.Weather);

  // Previous weather set.
  var previousWeatherArray = [];
  goog.structs.forEach(this.previousWeatherSet_, function(weather) {
    previousWeatherArray.push(transposedWeather[weather]);
  });

  // Current weather set.
  var weatherArray = [];
  goog.structs.forEach(this.weatherSet_, function(weather) {
    weatherArray.push(transposedWeather[weather]);
  });

  // Location.
  var fishLocationKey = goog.object.findKey(
      ff.model.LocationEnum,
      function(value, key, object) {
        return goog.string.caseInsensitiveCompare(
            value.getName(), this.location_.getName()) == 0;
      }, this);

  // Predator.
  var predator = this.predator_ || null;

  return {
    'key': this.key_,
    'name': this.name_,
    'previousWeatherSet': previousWeatherArray,
    'weatherSet': weatherArray,
    'startHour': this.startHour_,
    'endHour': this.endHour_,
    'location': fishLocationKey,
    'bestCatchPath': this.bestCatchPath_.toJson(),
    'predator': this.predator_,
    'predatorCount': this.predatorCount_
  };
};


/**
 * @param {!Object} json The JSON for a fish object.
 * @return {!ff.model.Fish} The parsed fish model.
 */
ff.model.Fish.fromJson = function(json) {

  // Figure out the previous weather set field.
  var previousWeatherSet = new goog.structs.Set();
  goog.array.forEach(json['previousWeatherSet'], function(weatherString) {
    var weather = ff.stringKeyToEnum(weatherString, ff.model.Weather);
    if (goog.isDefAndNotNull(weather)) {
      previousWeatherSet.add(weather);
    } else {
      throw Error('Unknown weather: ' + weatherString);
    }
  });

  // Figure out the weather set field.
  var weatherSet = new goog.structs.Set();
  goog.array.forEach(json['weatherSet'], function(weatherString) {
    var weather = ff.stringKeyToEnum(weatherString, ff.model.Weather);
    if (goog.isDefAndNotNull(weather)) {
      weatherSet.add(weather);
    } else {
      throw Error('Unknown weather: ' + weatherString);
    }
  });

  // Parse the location.
  var fishLocation = ff.stringKeyToEnum(
      json['location'], ff.model.LocationEnum);
  if (!fishLocation) {
    throw Error('Unknown location: ' + json['location']);
  }

  // Parse the predator.
  var predator = json['predator'] || '';

  // Construct the valid fish.
  return new ff.model.Fish(
      json['key'],
      json['name'],
      previousWeatherSet,
      weatherSet,
      json['startHour'],
      json['endHour'],
      ff.model.LocationEnum[fishLocation],
      ff.model.CatchPath.fromJson(json['bestCatchPath']),
      predator,
      json['predatorCount']);
};
