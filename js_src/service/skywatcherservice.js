/**
 * Service for interacting with fish data.
 */

goog.provide('ff.service.SkywatcherService');

goog.require('ff');
goog.require('ff.model.AreaEnum');
goog.require('ff.model.Weather');
goog.require('ff.service.XhrService');
goog.require('goog.Timer');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.string');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ff.service.SkywatcherService = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.service.SkywatcherService');

  /** @private {!ff.service.XhrService} */
  this.xhrService_ = ff.service.XhrService.getInstance();

  /** @private {!Object.<string, !Array.<!ff.model.Weather>>} */
  this.weather_ = {};

  /** @private {number} */
  this.eorzeaHour_ = 0;

  /** @private {!goog.Timer} */
  this.timer_ = new goog.Timer(ff.service.SkywatcherService.POLL_INTERVAL_MS_);
  this.registerDisposable(this.timer_);

  var handler = new goog.events.EventHandler(this);
  this.registerDisposable(handler);

  handler.listen(this.timer_, goog.Timer.TICK, this.getCurrentWeather_);
};
goog.inherits(ff.service.SkywatcherService, goog.events.EventTarget);
goog.addSingletonGetter(ff.service.SkywatcherService);


/**
 * @enum {string}
 */
ff.service.SkywatcherService.EventType = {
  WEATHER_UPDATED: ff.getUniqueId('weather-updated')
};


/**
 * The interval at which this client will poll the server for current weather.
 * @type {number}
 * @const
 * @private
 */
ff.service.SkywatcherService.POLL_INTERVAL_MS_ = 60 * 1000;


/**
 * Starts the polling for current weather.
 */
ff.service.SkywatcherService.prototype.startPolling = function() {
  this.timer_.start();
  this.timer_.dispatchTick();
};


/**
 * @param {!ff.model.Area} area
 * @return {!Array.<!ff.model.Weather>}
 */
ff.service.SkywatcherService.prototype.getWeatherForArea = function(area) {
  var areaEnum = goog.object.findKey(
      ff.model.AreaEnum,
      function(value, key, object) {
        return goog.string.caseInsensitiveCompare(
            value.getName(), area.getName()) == 0;
      });
  if (areaEnum) {
    return this.weather_[areaEnum];
  }
  throw Error('Failed to find this area: ' + area.getName());
};


/**
 * Gets the hour of the current weather report.
 * @return {number}
 */
ff.service.SkywatcherService.prototype.getWeatherReportHour = function() {
  return this.eorzeaHour_;
};


/**
 * Gets the current weather from the server.
 * @private
 */
ff.service.SkywatcherService.prototype.getCurrentWeather_ = function() {
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
ff.service.SkywatcherService.prototype.onWeatherLoaded_ = function(json) {
  goog.log.info(this.logger, 'Weather arrived from server.');

  this.eorzeaHour_ = json['eorzeaHour'];

  var weatherMap = json['weatherMap'];
  goog.object.forEach(
      ff.model.AreaEnum,
      function(area, key, obj) {
        var rawWeatherList = weatherMap[key];
        if (!rawWeatherList) {
          return; // No weather data for this location.
        }
        var weatherList = [];
        goog.array.forEach(rawWeatherList, function(rawWeather) {
          var weather = ff.stringKeyToEnum(rawWeather, ff.model.Weather);
          if (weather) {
            weatherList.push(weather);
          }
        });
        this.weather_[key] = weatherList;
      },
      this);

  this.dispatchEvent(ff.service.SkywatcherService.EventType.WEATHER_UPDATED);
};
