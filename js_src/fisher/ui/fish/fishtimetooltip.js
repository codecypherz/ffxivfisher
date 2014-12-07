/**
 * Service for dealing with time.
 */

goog.provide('ff.fisher.ui.fish.FishTimeTooltip');

goog.require('ff');
goog.require('ff.fisher.ui.fish.soy');
goog.require('ff.fisher.ui.weather.WeatherIcon');
goog.require('goog.dom');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.style');



/**
 * @constructor
 */
ff.fisher.ui.fish.FishTimeTooltip = function() {

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.fish.FishTimeTooltip');

  /** @private {Element} */
  this.tooltipElement_ = goog.soy.renderAsElement(
      ff.fisher.ui.fish.soy.FISH_TIME_TOOLTIP, {
        eorzeaTimeId: ff.fisher.ui.fish.FishTimeTooltip.Id_.EORZEA_TIME,
        earthTimeId: ff.fisher.ui.fish.FishTimeTooltip.Id_.EARTH_TIME,
        remainingTimeId: ff.fisher.ui.fish.FishTimeTooltip.Id_.REMAINING_TIME,
        weatherId: ff.fisher.ui.fish.FishTimeTooltip.Id_.WEATHER
      });

  document.body.appendChild(this.tooltipElement_);

  /** @private {Element} */
  this.eorzeaTimeElement_ = document.getElementById(
      ff.fisher.ui.fish.FishTimeTooltip.Id_.EORZEA_TIME);

  /** @private {Element} */
  this.earthTimeElement_ = document.getElementById(
      ff.fisher.ui.fish.FishTimeTooltip.Id_.EARTH_TIME);

  /** @private {Element} */
  this.remainingTimeElement_ = document.getElementById(
      ff.fisher.ui.fish.FishTimeTooltip.Id_.REMAINING_TIME);

  /** @private {Element} */
  this.weatherElement_ = document.getElementById(
      ff.fisher.ui.fish.FishTimeTooltip.Id_.WEATHER);

  /** @private {?ff.fisher.ui.weather.WeatherIcon} */
  this.weatherIcon_ = null;

  // Don't show it until needed.
  goog.style.setElementShown(this.tooltipElement_, false);
};
goog.addSingletonGetter(ff.fisher.ui.fish.FishTimeTooltip);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.fish.FishTimeTooltip.Id_ = {
  EARTH_TIME: ff.getUniqueId('earth-time'),
  EORZEA_TIME: ff.getUniqueId('eorzea-time'),
  REMAINING_TIME: ff.getUniqueId('remaining-time'),
  WEATHER: ff.getUniqueId('weather')
};


/**
 * @return {Element}
 */
ff.fisher.ui.fish.FishTimeTooltip.prototype.getElement = function() {
  return this.tooltipElement_;
};


/**
 * @param {string} eorzeaTime
 * @param {string} earthTime
 * @param {string} remainingTime
 */
ff.fisher.ui.fish.FishTimeTooltip.prototype.setText =
    function(eorzeaTime, earthTime, remainingTime) {
  goog.dom.setTextContent(this.eorzeaTimeElement_, eorzeaTime);
  goog.dom.setTextContent(this.earthTimeElement_, earthTime);
  goog.dom.setTextContent(this.remainingTimeElement_, remainingTime);
};


/**
 * @param {?ff.model.Weather} weather
 */
ff.fisher.ui.fish.FishTimeTooltip.prototype.setWeather = function(weather) {
  // Clear previous weather.
  if (this.weatherIcon_) {
    goog.dispose(this.weatherIcon_);
    this.weatherIcon_ = null;
  }

  // Clear remaining content such as text nodes.
  goog.dom.removeChildren(this.weatherElement_);

  // Render new weather knowledge.
  if (weather) {
    this.weatherIcon_ = new ff.fisher.ui.weather.WeatherIcon(weather);
    this.weatherIcon_.render(this.weatherElement_);
  } else {
    goog.dom.setTextContent(this.weatherElement_, 'unknown');
  }
};
