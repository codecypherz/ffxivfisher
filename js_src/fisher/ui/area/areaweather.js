/**
 * Renders fish for a single area.
 */

goog.provide('ff.fisher.ui.area.AreaWeather');

goog.require('ff');
goog.require('ff.fisher.ui.UpdateTimer');
goog.require('ff.fisher.ui.area.soy');
goog.require('ff.fisher.ui.weather.WeatherIcon');
goog.require('ff.service.EorzeaTime');
goog.require('ff.service.WeatherService');
goog.require('ff.ui');
goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @param {!ff.model.Area} area
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.area.AreaWeather = function(area) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.area.AreaWeather');

  /** @private {!ff.model.Area} */
  this.area_ = area;

  /** @private {!Array.<!ff.fisher.ui.weather.WeatherIcon>} */
  this.weatherIcons_ = [];

  /** @private {!ff.service.WeatherService} */
  this.weatherService_ = ff.service.WeatherService.getInstance();

  /** @private {!ff.service.EorzeaTime} */
  this.eorzeaTime_ = ff.service.EorzeaTime.getInstance();

  /** @private {!ff.fisher.ui.UpdateTimer} */
  this.updateTimer_ = ff.fisher.ui.UpdateTimer.getInstance();

  /** @private {Element} */
  this.weather1_ = null;

  /** @private {Element} */
  this.weather2_ = null;

  /** @private {Element} */
  this.weather3_ = null;

  /** @private {Element} */
  this.weather4_ = null;

  /** @private {Element} */
  this.weather5_ = null;
};
goog.inherits(ff.fisher.ui.area.AreaWeather, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.area.AreaWeather.Id_ = {
  WEATHER_1: ff.getUniqueId('weather-1'),
  WEATHER_2: ff.getUniqueId('weather-2'),
  WEATHER_3: ff.getUniqueId('weather-3'),
  WEATHER_4: ff.getUniqueId('weather-4'),
  WEATHER_5: ff.getUniqueId('weather-5')
};


/** @override */
ff.fisher.ui.area.AreaWeather.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.area.soy.AREA_WEATHER, {
        ids: this.makeIds(ff.fisher.ui.area.AreaWeather.Id_)
      }));

  this.weather1_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.area.AreaWeather.Id_.WEATHER_1);
  this.weather2_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.area.AreaWeather.Id_.WEATHER_2);
  this.weather3_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.area.AreaWeather.Id_.WEATHER_3);
  this.weather4_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.area.AreaWeather.Id_.WEATHER_4);
  this.weather5_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.area.AreaWeather.Id_.WEATHER_5);

  this.renderWeather_();
};


/** @override */
ff.fisher.ui.area.AreaWeather.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  // Listen for weather updates.
  this.getHandler().listen(
      this.weatherService_,
      ff.service.WeatherService.EventType.WEATHER_UPDATED,
      this.renderWeather_);

  // Update occasionally, but a little slower than time ticks.
  this.getHandler().listen(
      this.updateTimer_,
      goog.Timer.TICK,
      this.update_);

  // Update regularly and right now.
  goog.Timer.callOnce(this.update_, 50, this);
};


/**
 * Renders the current weather for this area.
 * @private
 */
ff.fisher.ui.area.AreaWeather.prototype.renderWeather_ = function() {
  if (!this.isInDocument()) {
    return;
  }

  // Clear existing weather icons.
  goog.array.forEach(this.weatherIcons_, function(weatherIcon) {
    this.removeChild(weatherIcon, true);
    goog.dispose(weatherIcon);
  }, this);
  this.weatherIcons_ = [];

  // Get the weather for this area.
  var weatherRanges = this.weatherService_.getWeatherRangesForArea(this.area_);

  // Render weather icons for each of the weather ranges.
  this.renderWeatherIcon_(
      ff.fisher.ui.area.AreaWeather.Id_.WEATHER_1, weatherRanges[0]);
  this.renderWeatherIcon_(
      ff.fisher.ui.area.AreaWeather.Id_.WEATHER_2, weatherRanges[1]);
  this.renderWeatherIcon_(
      ff.fisher.ui.area.AreaWeather.Id_.WEATHER_3, weatherRanges[2]);
  this.renderWeatherIcon_(
      ff.fisher.ui.area.AreaWeather.Id_.WEATHER_4, weatherRanges[3]);
  this.renderWeatherIcon_(
      ff.fisher.ui.area.AreaWeather.Id_.WEATHER_5, weatherRanges[4]);

  // Position the icons correctly and adjust visibility.
  this.update_();
};


/**
 * @param {!ff.fisher.ui.area.AreaWeather.Id_} id
 * @param {ff.model.WeatherRange} weatherRange
 * @private
 */
ff.fisher.ui.area.AreaWeather.prototype.renderWeatherIcon_ = function(
    id, weatherRange) {
  if (!weatherRange) {
    return;
  }
  var weatherIcon = new ff.fisher.ui.weather.WeatherIcon(
      weatherRange.getWeather());
  var container = ff.ui.getElementByFragment(this, id);
  this.addChild(weatherIcon);
  this.weatherIcons_.push(weatherIcon);
  weatherIcon.render(container);
};


/**
 * Updates the positions of the weather rectangles based on the current time.
 * @private
 */
ff.fisher.ui.area.AreaWeather.prototype.update_ = function() {
  if (!this.isInDocument()) {
    return;
  }

  var eorzeaDate = this.eorzeaTime_.getCurrentEorzeaDate();

  var weatherRanges = this.weatherService_.getWeatherTimeRanges();
  this.setLeft_(this.weather1_, weatherRanges[0], eorzeaDate);
  this.setLeft_(this.weather2_, weatherRanges[1], eorzeaDate);
  this.setLeft_(this.weather3_, weatherRanges[2], eorzeaDate);
  this.setLeft_(this.weather4_, weatherRanges[3], eorzeaDate);
  this.setLeft_(this.weather5_, weatherRanges[4], eorzeaDate);
};


/**
 * Sets the left side of the element based on the given range.
 * @param {Element} el
 * @param {!goog.math.Range} range
 * @param {!goog.date.UtcDateTime} eorzeaDate
 * @private
 */
ff.fisher.ui.area.AreaWeather.prototype.setLeft_ = function(
    el, range, eorzeaDate) {
  if (!range) {
    return;
  }
  el.style.left = this.toPixels_(range.start - eorzeaDate.getTime()) + 'px';
};


/**
 * Converts milliseconds to pixels.
 * @param {number} ms
 * @return {number}
 * @private
 */
ff.fisher.ui.area.AreaWeather.prototype.toPixels_ = function(ms) {
  return (ms / ff.service.EorzeaTime.MS_IN_A_DAY) * this.getWidth_();
};


/**
 * @return {number}
 * @private
 */
ff.fisher.ui.area.AreaWeather.prototype.getWidth_ = function() {
  return this.getElement().offsetWidth;
};
