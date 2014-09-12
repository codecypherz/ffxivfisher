
goog.provide('ff.model.WeatherRange');



/**
 * @param {!ff.model.Weather} weather
 * @param {!goog.math.Range} range
 * @constructor
 */
ff.model.WeatherRange = function(weather, range) {

  /** @private {!ff.model.Weather} */
  this.weather_ = weather;

  /** @private {!goog.math.Range} */
  this.range_ = range;
};


/** @return {!ff.model.Weather} */
ff.model.WeatherRange.prototype.getWeather = function() {
  return this.weather_;
};


/** @return {!goog.math.Range} */
ff.model.WeatherRange.prototype.getRange = function() {
  return this.range_;
};
