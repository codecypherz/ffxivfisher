/**
 * Service for watching which fish can be caught right now.
 */

goog.provide('ff.service.FishWatcher');

goog.require('ff');
goog.require('ff.service.EorzeaTime');
goog.require('ff.service.FishService');
goog.require('ff.service.WeatherService');
goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.log');
goog.require('goog.math.Range');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ff.service.FishWatcher = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.service.FishWatcher');

  /** @private {!ff.service.EorzeaTime} */
  this.eorzeaTime_ = ff.service.EorzeaTime.getInstance();

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();

  /** @private {!ff.service.WeatherService} */
  this.skywatcherService_ = ff.service.WeatherService.getInstance();

  this.handler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.handler_);

  // Check fish whenever the fish data changes.
  this.handler_.listen(
      this.fishService_,
      ff.service.FishService.EventType.FISH_CHANGED,
      this.checkFish_);

  // Check fish whenever the clock ticks.
  this.handler_.listen(
      this.eorzeaTime_,
      goog.Timer.TICK,
      this.checkFish_);

  // Check fish right now.
  this.logger.info('Checking fish for the first time.');
  this.checkFish_();
};
goog.inherits(ff.service.FishWatcher, goog.events.EventTarget);
goog.addSingletonGetter(ff.service.FishWatcher);


/**
 * The events dispatched by this object.
 * @enum {string}
 */
ff.service.FishWatcher.EventType = {
  CATCHABLE_SET_CHANGED: ff.getUniqueId('catchable-set-changed')
};


/**
 * Checks to see which fish can be caught right now and updates the
 * corresponding fish.
 * @private
 */
ff.service.FishWatcher.prototype.checkFish_ = function() {
  var eorzeaDate = this.eorzeaTime_.getCurrentEorzeaDate();

  var currentHour =
      eorzeaDate.getUTCHours() + (eorzeaDate.getUTCMinutes() / 60.0);

  goog.array.forEach(this.fishService_.getAll(), function(fish) {

    // Update time ranges on each fish.
    var hoursUntilNextStart = this.eorzeaTime_.getHoursUntilNextHour(
        currentHour, fish.getStartHour());
    var nextStartMs = eorzeaDate.getTime() + this.eorzeaTime_.hoursToMs(
        hoursUntilNextStart);
    var nextRange = new goog.math.Range(
        nextStartMs,
        nextStartMs + this.eorzeaTime_.hoursToMs(fish.getRangeLength()));
    var previousRange = new goog.math.Range(
        nextRange.start - ff.service.EorzeaTime.MS_IN_A_DAY,
        nextRange.end - ff.service.EorzeaTime.MS_IN_A_DAY);
    fish.setTimeRanges(previousRange, nextRange);

    // TODO Switch this to setting catchable ranges instead by intersecting
    // weather ranges with time ranges.
    fish.setCatchable(this.isCatchable_(fish, eorzeaDate.getUTCHours()));
  }, this);

  // TODO If the set of fish that is catchable has changed, dispatch an event.
  //this.dispatchEvent(ff.service.FishWatcher.EventType.CATCHABLE_SET_CHANGED);
};


/**
 * Checks to see if the given fish is catchable.
 * @param {!ff.model.Fish} fish The fish being checked.
 * @param {number} currentHour The current Eorzean hour.
 * @return {boolean} True if the given fish is catchable.
 * @private
 */
ff.service.FishWatcher.prototype.isCatchable_ = function(fish, currentHour) {
  return this.isTimeValid_(fish, currentHour) && this.isWeatherValid_(fish);
};


/**
 * Checks to see if the weather conditions are correct for the given fish.
 * @param {!ff.model.Fish} fish
 * @return {boolean}
 * @private
 */
ff.service.FishWatcher.prototype.isWeatherValid_ = function(fish) {
  var weatherSet = fish.getWeatherSet();

  // Fish can be caught in any weather.
  if (weatherSet.isEmpty()) {
    return true;
  }

  // Current weather must be in the set.
  var weatherList = this.skywatcherService_.getWeatherForArea(
      fish.getLocation().getArea());
  var currentWeather = weatherList[0];
  if (currentWeather) {
    return fish.getWeatherSet().contains(currentWeather);
  }

  // Don't know current weather, so weather isn't valid.
  return false;
};


/**
 * Checks to see if the current time condition is right for the given fish.
 * @param {!ff.model.Fish} fish
 * @param {number} currentHour
 * @return {boolean}
 * @private
 */
ff.service.FishWatcher.prototype.isTimeValid_ = function(fish, currentHour) {
  var wrapAround = fish.getEndHour() < fish.getStartHour();
  if (wrapAround) {
    return this.isHourInRange_(currentHour, 0, fish.getEndHour()) ||
        this.isHourInRange_(currentHour, fish.getStartHour(), 23);
  } else {
    return this.isHourInRange_(
        currentHour, fish.getStartHour(), fish.getEndHour());
  }
};


/**
 * @param {number} hour
 * @param {number} start
 * @param {number} end
 * @return {boolean}
 * @private
 */
ff.service.FishWatcher.prototype.isHourInRange_ = function(hour, start, end) {
  return (start <= hour) && (hour <= end);
};
