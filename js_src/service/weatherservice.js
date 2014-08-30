/**
 * Service for interacting with weather data.
 */

goog.provide('ff.service.WeatherService');

goog.require('goog.events.EventTarget');
goog.require('goog.log');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ff.service.WeatherService = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.service.WeatherService');
};
goog.inherits(ff.service.WeatherService, goog.events.EventTarget);
goog.addSingletonGetter(ff.service.WeatherService);


/**
 * Gets the URL for the weather image.
 * @param {!ff.model.Weather} weather
 * @return {string}
 */
ff.service.WeatherService.prototype.getImageUrl = function(weather) {
  var weatherString = weather.replace('/\s/', '_').toLowerCase();
  return '/images/weather/' + weatherString + '.png';
};
