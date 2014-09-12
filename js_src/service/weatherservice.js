/**
 * Service for interacting with fish data.
 */

goog.provide('ff.service.WeatherService');

goog.require('ff');
goog.require('ff.model.AreaEnum');
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
goog.require('goog.string');



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
  this.weatherRanges_ = {};

  // TODO Remove extraneous instance variables once weather ranges are used.
  /** @private {!Object.<string, !Array.<!ff.model.Weather>>} */
  this.weather_ = {};

  /** @private {number} */
  this.reportHour_ = 0;

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
  return '/images/weather/' + weather.toLowerCase() + '.png';
};


/**
 * @param {!ff.model.Area} area
 * @return {!Array.<!ff.model.WeatherRange>}
 */
ff.service.WeatherService.prototype.getWeatherRangesForArea = function(area) {
  // Figure out the area enum for the area model.
  var areaEnum = goog.object.findKey(
      ff.model.AreaEnum,
      function(value, key, object) {
        return goog.string.caseInsensitiveCompare(
            value.getName(), area.getName()) == 0;
      });

  // This shouldn't happen unless a new area gets added to the game.
  if (!areaEnum) {
    throw Error('Failed to find this area: ' + area.getName());
  }

  var weatherRanges = this.weatherRanges_[areaEnum];
  if (!goog.isDefAndNotNull(weatherRanges)) {
    // No data for this area.
    return [];
  }

  return weatherRanges;
};


/**
 * TODO Delete.
 * @param {!ff.model.Area} area
 * @return {!Array.<!ff.model.Weather>}
 */
ff.service.WeatherService.prototype.getWeatherForArea = function(area) {
  // Figure out the area enum for the area model.
  var areaEnum = goog.object.findKey(
      ff.model.AreaEnum,
      function(value, key, object) {
        return goog.string.caseInsensitiveCompare(
            value.getName(), area.getName()) == 0;
      });

  // This shouldn't happen unless a new area gets added to the game.
  if (!areaEnum) {
    throw Error('Failed to find this area: ' + area.getName());
  }

  // Get the current time.
  var eorzeaDate = this.eorzeaTime_.getCurrentEorzeaDate();
  var currentHour =
      eorzeaDate.getUTCHours() + (eorzeaDate.getUTCMinutes() / 60.0);

  // Compute the offset in order to ignore past weather.
  var nextWeatherChangeHour = this.getNextWeatherChangeHour(currentHour);
  var offset;
  if (this.reportHour_ >= (nextWeatherChangeHour - 8)) {
    offset = 0;
  } else if (this.reportHour_ >= (nextWeatherChangeHour - 16)) {
    offset = 1;
  } else {
    offset = 2;
  }

  var weatherSourceList = this.weather_[areaEnum];
  if (!goog.isDefAndNotNull(weatherSourceList)) {
    // No data for this area.
    return [];
  }

  // Filter the source list based on the offset.
  var currentWeather = [];
  for (var i = 0; i < 4; i++) {
    var weather = weatherSourceList[i + offset];
    if (weather) {
      currentWeather.push(weather);
    }
  }
  return currentWeather;
};


/**
 * Figures out the next hour that weather will change based on the current hour.
 * @param {number} currentHour
 * @return {number}
 */
ff.service.WeatherService.prototype.getNextWeatherChangeHour = function(
    currentHour) {
  if (currentHour < 8) {
    return 8;
  } else if (currentHour < 16) {
    return 16;
  }
  return 24;
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

  this.reportHour_ = json['eorzeaHour'];

  var startHour = 0;
  if (this.reportHour_ >= 8) {
    startHour = 8;
  } else if (this.reportHour_ >= 16) {
    startHour = 16;
  }

  var reportStartMs = eorzeaDate.getTime() + this.eorzeaTime_.hoursToMs(
      startHour - currentHour);
  var rangeWidth = this.eorzeaTime_.hoursToMs(8);

  var weatherMap = json['weatherMap'];
  goog.object.forEach(
      ff.model.AreaEnum,
      function(area, key, obj) {
        var rawWeatherList = weatherMap[key];
        if (!rawWeatherList) {
          return; // No weather data for this area.
        }
        var weatherRangeList = [];
        var weatherList = [];
        var nextStartMs = reportStartMs;
        goog.array.forEach(rawWeatherList, function(rawWeather) {
          var weather = /** @type {!ff.model.Weather} */ (
              ff.stringKeyToEnum(rawWeather, ff.model.Weather));
          var range = new goog.math.Range(
              nextStartMs, nextStartMs + rangeWidth);
          if (weather) {
            weatherList.push(weather);
            weatherRangeList.push(new ff.model.WeatherRange(weather, range));
          }
          nextStartMs += rangeWidth;
        });
        this.weatherRanges_[key] = weatherRangeList;
        this.weather_[key] = weatherList;
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
    this.dispatchEvent(ff.service.WeatherService.EventType.WEATHER_UPDATED);
  }
};
