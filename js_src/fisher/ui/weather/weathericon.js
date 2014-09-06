/**
 * Renders a single weather icon.
 */

goog.provide('ff.fisher.ui.weather.WeatherIcon');

goog.require('ff.fisher.ui.weather.soy');
goog.require('ff.model.Weather');
goog.require('ff.service.WeatherService');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @param {!ff.model.Weather} weather
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.weather.WeatherIcon = function(weather) {
  goog.base(this);

  /** @private {!ff.model.Weather} */
  this.weather_ = weather;

  /** @private {!ff.service.WeatherService} */
  this.weatherService_ = ff.service.WeatherService.getInstance();
};
goog.inherits(ff.fisher.ui.weather.WeatherIcon, goog.ui.Component);


/** @override */
ff.fisher.ui.weather.WeatherIcon.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.weather.soy.WEATHER_ICON, {
        imageSrc: this.weatherService_.getImageUrl(this.weather_),
        tooltip: ff.model.Weather[this.weather_]
      }));
};
