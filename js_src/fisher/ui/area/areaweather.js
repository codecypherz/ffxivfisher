/**
 * Renders fish for a single area.
 */

goog.provide('ff.fisher.ui.area.AreaWeather');

goog.require('ff');
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

  /** @private {Element} */
  this.weather1_ = null;

  /** @private {Element} */
  this.weather2_ = null;

  /** @private {Element} */
  this.weather3_ = null;

  /** @private {Element} */
  this.weather4_ = null;

  /** @private {!goog.Timer} */
  this.timer_ = new goog.Timer(
      ff.fisher.ui.area.AreaWeather.UPDATE_INTERVAL_MS_);
  this.registerDisposable(this.timer_);
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
  WEATHER_4: ff.getUniqueId('weather-4')
};


/**
 * @type {number}
 * @const
 * @private
 */
ff.fisher.ui.area.AreaWeather.UPDATE_INTERVAL_MS_ = 3000;


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
      this.timer_,
      goog.Timer.TICK,
      this.updateWeatherBlocks_);

  // Update regularly and right now.
  this.timer_.start();
  goog.Timer.callOnce(this.updateWeatherBlocks_, 50, this);
};


/** @override */
ff.fisher.ui.area.AreaWeather.prototype.exitDocument = function() {
  this.timer_.stop();
  goog.base(this, 'exitDocument');
};


/**
 * Updates the positions of the weather rectangles based on the current time.
 * @private
 */
ff.fisher.ui.area.AreaWeather.prototype.updateWeatherBlocks_ = function() {
  if (!this.isInDocument()) {
    return;
  }

  var eorzeaDate = this.eorzeaTime_.getCurrentEorzeaDate();
  var currentHour =
      eorzeaDate.getUTCHours() + (eorzeaDate.getUTCMinutes() / 60.0);

  var hoursUntilNextPositiveStart = this.eorzeaTime_.getHoursUntilNextHour(
      currentHour,
      this.weatherService_.getNextWeatherChangeHour(currentHour));

  this.setLeft_(
      this.weather1_,
      hoursUntilNextPositiveStart - 8);
  this.setLeft_(
      this.weather2_,
      hoursUntilNextPositiveStart);
  this.setLeft_(
      this.weather3_,
      hoursUntilNextPositiveStart + 8);
  this.setLeft_(
      this.weather4_,
      hoursUntilNextPositiveStart + 16);
};


/**
 * Sets the left side of the element relative to the current time assuming the
 * current time is at relative position 0.
 * @param {Element} el
 * @param {number} hoursFromLeft
 * @private
 */
ff.fisher.ui.area.AreaWeather.prototype.setLeft_ = function(el, hoursFromLeft) {
  var width = this.getElement().offsetWidth;
  var offsetPercent = hoursFromLeft / 24.0;
  var offsetInPixels = width * offsetPercent;
  el.style.left = offsetInPixels + 'px';
};


/**
 * Renders the current weather for this area.
 * @private
 */
ff.fisher.ui.area.AreaWeather.prototype.renderWeather_ = function() {
  // TODO Render this when a new time block passes.
  this.updateWeatherBlocks_();

  var weatherList = this.weatherService_.getWeatherForArea(this.area_);

  // Clear existing weather icons.
  goog.array.forEach(this.weatherIcons_, function(weatherIcon) {
    this.removeChild(weatherIcon, true);
    goog.dispose(weatherIcon);
  }, this);
  this.weatherIcons_ = [];

  this.renderWeatherIcon_(
      ff.fisher.ui.area.AreaWeather.Id_.WEATHER_1, weatherList[0]);
  this.renderWeatherIcon_(
      ff.fisher.ui.area.AreaWeather.Id_.WEATHER_2, weatherList[1]);
  this.renderWeatherIcon_(
      ff.fisher.ui.area.AreaWeather.Id_.WEATHER_3, weatherList[2]);
  this.renderWeatherIcon_(
      ff.fisher.ui.area.AreaWeather.Id_.WEATHER_4, weatherList[3]);
};


/**
 * @param {!ff.fisher.ui.area.AreaWeather.Id_} id
 * @param {ff.model.Weather} weather
 * @private
 */
ff.fisher.ui.area.AreaWeather.prototype.renderWeatherIcon_ = function(
    id, weather) {
  if (!weather) {
    return;
  }
  var weatherIcon = new ff.fisher.ui.weather.WeatherIcon(weather);
  var container = ff.ui.getElementByFragment(this, id);
  this.addChild(weatherIcon);
  this.weatherIcons_.push(weatherIcon);
  weatherIcon.render(container);
};
