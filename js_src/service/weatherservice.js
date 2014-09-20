/**
 * Service for interacting with fish data.
 */

goog.provide('ff.service.WeatherService');

goog.require('ff');
goog.require('ff.model.Area');
goog.require('ff.model.AreaEnum');
goog.require('ff.model.Image');
goog.require('ff.model.Weather');
goog.require('ff.model.WeatherRange');
goog.require('ff.service.EorzeaTime');
goog.require('ff.service.XhrService');
goog.require('goog.Timer');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.log');
goog.require('goog.math.Range');
goog.require('goog.object');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ff.service.WeatherService = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.service.WeatherService');

  /** @private {!ff.service.XhrService} */
  this.xhrService_ = ff.service.XhrService.getInstance();

  /** @private {!ff.service.EorzeaTime} */
  this.eorzeaTime_ = ff.service.EorzeaTime.getInstance();

  /** @private {!Object.<string, !Array.<!ff.model.WeatherRange>>} */
  this.weatherRangeMap_ = {};

  /** @private {!Array.<!goog.math.Range>} */
  this.weatherRanges_ = [];

  /** @private {number} */
  this.lastSeenHour_ = 0;

  /** @private {!goog.Timer} */
  this.timer_ = new goog.Timer(ff.service.WeatherService.POLL_INTERVAL_MS_);
  this.registerDisposable(this.timer_);

  var handler = new goog.events.EventHandler(this);
  this.registerDisposable(handler);

  handler.listen(this.timer_, goog.Timer.TICK, this.getCurrentWeather_);
  handler.listen(this.eorzeaTime_, goog.Timer.TICK, this.checkWeatherInterval_);
};
goog.inherits(ff.service.WeatherService, goog.events.EventTarget);
goog.addSingletonGetter(ff.service.WeatherService);


/**
 * @enum {string}
 */
ff.service.WeatherService.EventType = {
  WEATHER_INTERVAL_CHANGED: ff.getUniqueId('weather-interval-changed'),
  WEATHER_UPDATED: ff.getUniqueId('weather-updated')
};


/**
 * The interval at which this client will poll the server for current weather.
 * @type {number}
 * @const
 * @private
 */
ff.service.WeatherService.POLL_INTERVAL_MS_ = 60 * 1000;


/**
 * Starts the polling for current weather.
 */
ff.service.WeatherService.prototype.startPolling = function() {
  this.timer_.start();
  this.timer_.dispatchTick();
};


/**
 * Gets the URL for the weather image.
 * @param {!ff.model.Weather} weather
 * @return {string}
 */
ff.service.WeatherService.prototype.getImageUrl = function(weather) {
  return ff.model.Image.getUrl('weather', weather);
};


/** @return {!Array.<!goog.math.Range>} */
ff.service.WeatherService.prototype.getWeatherTimeRanges = function() {
  return this.weatherRanges_;
};


/**
 * @param {!ff.model.Area} area
 * @return {!Array.<!ff.model.WeatherRange>}
 */
ff.service.WeatherService.prototype.getWeatherRangesForArea = function(area) {
  var areaEnum = ff.model.Area.getEnum(area);

  var weatherRanges = this.weatherRangeMap_[areaEnum];
  if (!goog.isDefAndNotNull(weatherRanges)) {
    // No data for this area.
    return [];
  }

  return weatherRanges;
};


/**
 * Gets the current weather from the server.
 * @private
 */
ff.service.WeatherService.prototype.getCurrentWeather_ = function() {
  goog.log.info(this.logger, 'Getting current weather from server.');

  var uri = new goog.Uri();
  uri.setPath('/skywatcher');

  // Send the request.
  var deferred = this.xhrService_.get(uri, true);

  // Handle the response.
  deferred.addCallback(this.onWeatherLoaded_, this);
};


/**
 * Called when weather loads from the server.
 * @param {Object} json
 * @private
 */
ff.service.WeatherService.prototype.onWeatherLoaded_ = function(json) {
  goog.log.info(this.logger, 'Weather arrived from server.');

  var eorzeaDate = this.eorzeaTime_.getCurrentEorzeaDate();
  var currentHour =
      eorzeaDate.getUTCHours() + (eorzeaDate.getUTCMinutes() / 60.0);

  var reportHour = json['eorzeaHour'];

  // Figure out the starting hour of the range in which the report hour occurs.
  var startHour = 0;
  if (reportHour >= 8) {
    startHour = 8;
  }
  if (reportHour >= 16) {
    startHour = 16;
  }

  // Define actual ranges based on the start hour.
  this.weatherRanges_ = [];
  var reportStartMs = eorzeaDate.getTime() + this.eorzeaTime_.hoursToMs(
      startHour - currentHour);
  var rangeWidth = this.eorzeaTime_.hoursToMs(8);
  for (var i = 0; i < 6; i++) {
    this.weatherRanges_.push(new goog.math.Range(
        reportStartMs + (i * rangeWidth),
        reportStartMs + ((i + 1) * rangeWidth)));
  }

  // Map areas to their weather ranges.
  var weatherMap = json['weatherMap'];
  goog.object.forEach(
      ff.model.AreaEnum,
      function(area, key, obj) {
        var rawWeatherList = weatherMap[key];
        if (!rawWeatherList) {
          return; // No weather data for this area.
        }
        var weatherRangeList = [];
        goog.array.forEach(rawWeatherList, function(rawWeather, i, arr) {
          var weather = /** @type {!ff.model.Weather} */ (
              ff.stringKeyToEnum(rawWeather, ff.model.Weather));
          if (weather) {
            weatherRangeList.push(
                new ff.model.WeatherRange(weather, this.weatherRanges_[i]));
          } // else no weather for this particular range or unknown weather.
        }, this);
        this.weatherRangeMap_[key] = weatherRangeList;
      },
      this);

  this.dispatchEvent(ff.service.WeatherService.EventType.WEATHER_UPDATED);
};


/**
 * Checks to see if a new weather interval was just entered.  If so, an event is
 * dispatched.
 * @private
 */
ff.service.WeatherService.prototype.checkWeatherInterval_ = function() {
  var eorzeaDate = this.eorzeaTime_.getCurrentEorzeaDate();
  var currentHour = eorzeaDate.getUTCHours();
  if (currentHour == this.lastSeenHour_) {
    // Nothing changed, so don't do any more.
    return;
  }

  // The hour changed, so save it.
  this.lastSeenHour_ = currentHour;

  // Check if this is a new weather interval too.
  if (currentHour == 0 || currentHour == 8 || currentHour == 16) {
    goog.log.info(this.logger, 'New weather interval identified.');
    this.dispatchEvent(
        ff.service.WeatherService.EventType.WEATHER_INTERVAL_CHANGED);
  }
};
