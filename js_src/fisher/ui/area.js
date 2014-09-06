/**
 * Renders fish for a single area.
 */

goog.provide('ff.fisher.ui.Area');

goog.require('ff');
goog.require('ff.fisher.ui.FishRow');
goog.require('ff.fisher.ui.WeatherIcon');
goog.require('ff.fisher.ui.soy');
goog.require('ff.service.FishService');
goog.require('ff.service.FishWatcher');
goog.require('ff.service.SkywatcherService');
goog.require('ff.ui');
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
ff.fisher.ui.Area = function(area) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.Area');

  /** @private {!ff.model.Area} */
  this.area_ = area;

  /** @private {!Array.<!ff.fisher.ui.WeatherIcon>} */
  this.weatherIcons_ = [];

  /** @private {!Array.<!ff.fisher.ui.FishRow>} */
  this.fishRows_ = [];

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();

  /** @private {!ff.service.FishWatcher} */
  this.fishWatcher_ = ff.service.FishWatcher.getInstance();

  /** @private {!ff.service.SkywatcherService} */
  this.skywatcherService_ = ff.service.SkywatcherService.getInstance();
};
goog.inherits(ff.fisher.ui.Area, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.Area.Id_ = {
  FISH_ROWS: ff.getUniqueId('fish-rows'),
  WEATHER_1: ff.getUniqueId('weather-1'),
  WEATHER_2: ff.getUniqueId('weather-2'),
  WEATHER_3: ff.getUniqueId('weather-3')
};


/** @override */
ff.fisher.ui.Area.prototype.createDom = function() {
  // Render soy template.
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.soy.AREA, {
        ids: this.makeIds(ff.fisher.ui.Area.Id_),
        name: this.area_.getName()
      }));

  this.renderFish_();
  this.renderWeather_();
};


/** @override */
ff.fisher.ui.Area.prototype.enterDocument = function() {
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
};


/**
 * Renders the fish in this area.
 * @private
 */
ff.fisher.ui.Area.prototype.renderFish_ = function() {
  var fishes = this.fishService_.getForArea(this.area_);

  // Clear existing fish.
  goog.array.forEach(this.fishRows_, function(fishRow) {
    this.removeChild(fishRow, true);
    goog.dispose(fishRow);
  }, this);
  this.fishRows_ = [];

  var fishRowsElement = ff.ui.getElementByFragment(
      this, ff.fisher.ui.Area.Id_.FISH_ROWS);

  // Render the fish.
  goog.array.forEach(fishes, function(fish) {
    var fishRow = new ff.fisher.ui.FishRow(fish);
    this.fishRows_.push(fishRow);
    this.addChild(fishRow);
    fishRow.render(fishRowsElement);
  }, this);

  // Hide the component if there are no fish.
  goog.style.setElementShown(this.getElement(), fishes.length > 0);
};


/**
 * Renders the current weather for this area.
 * @private
 */
ff.fisher.ui.Area.prototype.renderWeather_ = function() {
  var weatherList = this.skywatcherService_.getWeatherForArea(this.area_);

  // Clear existing weather icons.
  goog.array.forEach(this.weatherIcons_, function(weatherIcon) {
    this.removeChild(weatherIcon, true);
    goog.dispose(weatherIcon);
  }, this);
  this.weatherIcons_ = [];

  // TODO Make this work based on how far along the time is.  Right now this
  // is setting weather for the incorrect times.
  if (goog.isDefAndNotNull(weatherList)) {
    this.renderWeatherIcon_(ff.fisher.ui.Area.Id_.WEATHER_1, weatherList[0]);
    this.renderWeatherIcon_(ff.fisher.ui.Area.Id_.WEATHER_2, weatherList[1]);
    this.renderWeatherIcon_(ff.fisher.ui.Area.Id_.WEATHER_3, weatherList[2]);
  }
};


/**
 * @param {!ff.fisher.ui.Area.Id_} id
 * @param {ff.model.Weather} weather
 * @private
 */
ff.fisher.ui.Area.prototype.renderWeatherIcon_ = function(id, weather) {
  if (!weather) {
    return;
  }
  var weatherIcon = new ff.fisher.ui.WeatherIcon(weather);
  var container = ff.ui.getElementByFragment(this, id);
  this.addChild(weatherIcon);
  this.weatherIcons_.push(weatherIcon);
  weatherIcon.render(container);
};
