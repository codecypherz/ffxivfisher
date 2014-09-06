/**
 * Renders fish for a single area.
 */

goog.provide('ff.fisher.ui.area.Area');

goog.require('ff');
goog.require('ff.fisher.ui.WeatherIcon');
goog.require('ff.fisher.ui.area.soy');
goog.require('ff.fisher.ui.fish.FishRow');
goog.require('ff.service.EorzeaTime');
goog.require('ff.service.FishService');
goog.require('ff.service.FishWatcher');
goog.require('ff.service.SkywatcherService');
goog.require('ff.ui');
goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.style');
goog.require('goog.ui.Component');



/**
 * @param {!ff.model.Area} area
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.area.Area = function(area) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.area.Area');

  /** @private {!ff.model.Area} */
  this.area_ = area;

  /** @private {!Array.<!ff.fisher.ui.WeatherIcon>} */
  this.weatherIcons_ = [];

  /** @private {!Array.<!ff.fisher.ui.fish.FishRow>} */
  this.fishRows_ = [];

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();

  /** @private {!ff.service.FishWatcher} */
  this.fishWatcher_ = ff.service.FishWatcher.getInstance();

  /** @private {!ff.service.SkywatcherService} */
  this.skywatcherService_ = ff.service.SkywatcherService.getInstance();

  /** @private {!ff.service.EorzeaTime} */
  this.eorzeaTime_ = ff.service.EorzeaTime.getInstance();

  /** @private {Element} */
  this.weatherList_ = null;

  /** @private {Element} */
  this.weather1_ = null;

  /** @private {Element} */
  this.weather2_ = null;

  /** @private {Element} */
  this.weather3_ = null;

  /** @private {Element} */
  this.weather4_ = null;

  /** @private {!goog.Timer} */
  this.timer_ = new goog.Timer(ff.fisher.ui.area.Area.UPDATE_INTERVAL_MS_);
  this.registerDisposable(this.timer_);
};
goog.inherits(ff.fisher.ui.area.Area, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.area.Area.Id_ = {
  FISH_ROWS: ff.getUniqueId('fish-rows'),
  WEATHER_LIST: ff.getUniqueId('weather-list'),
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
ff.fisher.ui.area.Area.UPDATE_INTERVAL_MS_ = 3000;


/** @override */
ff.fisher.ui.area.Area.prototype.createDom = function() {
  // Render soy template.
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.area.soy.AREA, {
        ids: this.makeIds(ff.fisher.ui.area.Area.Id_),
        name: this.area_.getName()
      }));

  this.weatherList_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.area.Area.Id_.WEATHER_LIST);
  this.weather1_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.area.Area.Id_.WEATHER_1);
  this.weather2_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.area.Area.Id_.WEATHER_2);
  this.weather3_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.area.Area.Id_.WEATHER_3);
  this.weather4_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.area.Area.Id_.WEATHER_4);

  this.renderFish_();
  this.renderWeather_();
};


/** @override */
ff.fisher.ui.area.Area.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  // Listen for fish updates.
  this.getHandler().listen(
      this.fishService_,
      ff.service.FishService.EventType.FISH_CHANGED,
      this.renderFish_);

  this.getHandler().listen(
      this.fishWatcher_,
      ff.service.FishWatcher.EventType.CATCHABLE_SET_CHANGED,
      this.renderFish_);

  this.getHandler().listen(
      this.skywatcherService_,
      ff.service.SkywatcherService.EventType.WEATHER_UPDATED,
      this.renderWeather_);

  // Listen for when to update.
  this.getHandler().listen(
      this.timer_,
      goog.Timer.TICK,
      this.updateWeatherBlocks_);

  // Update regularly and right now.
  this.timer_.start();
  goog.Timer.callOnce(this.updateWeatherBlocks_, 50, this);
};


/** @override */
ff.fisher.ui.area.Area.prototype.exitDocument = function() {
  this.timer_.stop();
  goog.base(this, 'exitDocument');
};


/**
 * Renders the fish in this area.
 * @private
 */
ff.fisher.ui.area.Area.prototype.renderFish_ = function() {
  var fishes = this.fishService_.getForArea(this.area_);

  // Clear existing fish.
  goog.array.forEach(this.fishRows_, function(fishRow) {
    this.removeChild(fishRow, true);
    goog.dispose(fishRow);
  }, this);
  this.fishRows_ = [];

  var fishRowsElement = ff.ui.getElementByFragment(
      this, ff.fisher.ui.area.Area.Id_.FISH_ROWS);

  // Render the fish.
  goog.array.forEach(fishes, function(fish) {
    var fishRow = new ff.fisher.ui.fish.FishRow(fish);
    this.fishRows_.push(fishRow);
    this.addChild(fishRow);
    fishRow.render(fishRowsElement);
  }, this);

  // Hide the component if there are no fish.
  goog.style.setElementShown(this.getElement(), fishes.length > 0);
};


/**
 * Updates the positions of the weather rectangles based on the current time.
 * @private
 */
ff.fisher.ui.area.Area.prototype.updateWeatherBlocks_ = function() {
  if (!this.isInDocument()) {
    return;
  }

  var eorzeaDate = this.eorzeaTime_.getCurrentEorzeaDate();
  var currentHour =
      eorzeaDate.getUTCHours() + (eorzeaDate.getUTCMinutes() / 60.0);

  var hoursUntilNextPositiveStart = this.eorzeaTime_.getHoursUntilNextHour(
      currentHour, this.getNextWeatherChangeHour_(currentHour));

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
ff.fisher.ui.area.Area.prototype.setLeft_ = function(el, hoursFromLeft) {
  var width = this.weatherList_.offsetWidth;
  var offsetPercent = hoursFromLeft / 24.0;
  var offsetInPixels = width * offsetPercent;
  el.style.left = offsetInPixels + 'px';
};


/**
 * Renders the current weather for this area.
 * @private
 */
ff.fisher.ui.area.Area.prototype.renderWeather_ = function() {
  this.updateWeatherBlocks_();

  var weatherList = this.skywatcherService_.getWeatherForArea(this.area_);
  var reportHour = this.skywatcherService_.getWeatherReportHour();

  // Figure out the starting index.
  var eorzeaDate = this.eorzeaTime_.getCurrentEorzeaDate();
  var currentHour =
      eorzeaDate.getUTCHours() + (eorzeaDate.getUTCMinutes() / 60.0);

  var nextWeatherChangeHour = this.getNextWeatherChangeHour_(currentHour);
  var offset;
  if (reportHour >= (nextWeatherChangeHour - 8)) {
    offset = 0;
  } else if (reportHour >= (nextWeatherChangeHour - 16)) {
    offset = 1;
  } else {
    offset = 2;
  }

  // Clear existing weather icons.
  goog.array.forEach(this.weatherIcons_, function(weatherIcon) {
    this.removeChild(weatherIcon, true);
    goog.dispose(weatherIcon);
  }, this);
  this.weatherIcons_ = [];

  if (goog.isDefAndNotNull(weatherList)) {
    this.renderWeatherIcon_(
        ff.fisher.ui.area.Area.Id_.WEATHER_1, weatherList[0 + offset]);
    this.renderWeatherIcon_(
        ff.fisher.ui.area.Area.Id_.WEATHER_2, weatherList[1 + offset]);
    this.renderWeatherIcon_(
        ff.fisher.ui.area.Area.Id_.WEATHER_3, weatherList[2 + offset]);
    this.renderWeatherIcon_(
        ff.fisher.ui.area.Area.Id_.WEATHER_4, weatherList[3 + offset]);
  }
};


/**
 * @param {number} currentHour
 * @return {number}
 * @private
 */
ff.fisher.ui.area.Area.prototype.getNextWeatherChangeHour_ = function(
    currentHour) {
  if (currentHour < 8) {
    return 8;
  } else if (currentHour < 16) {
    return 16;
  }
  return 24;
};


/**
 * @param {!ff.fisher.ui.area.Area.Id_} id
 * @param {ff.model.Weather} weather
 * @private
 */
ff.fisher.ui.area.Area.prototype.renderWeatherIcon_ = function(id, weather) {
  if (!weather) {
    return;
  }
  var weatherIcon = new ff.fisher.ui.WeatherIcon(weather);
  var container = ff.ui.getElementByFragment(this, id);
  this.addChild(weatherIcon);
  this.weatherIcons_.push(weatherIcon);
  weatherIcon.render(container);
};
