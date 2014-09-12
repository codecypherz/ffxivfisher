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
  this.weatherService_ = ff.service.WeatherService.getInstance();

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

    // Compute the intersections of weather ranges with time ranges.
    var weatherRanges = this.weatherService_.getWeatherRangesForArea(
        fish.getLocation().getArea());
    var intersections = [];
    goog.array.forEach(weatherRanges, function(weatherRange) {
      if (!fish.getWeatherSet().contains(weatherRange.getWeather())) {
        return;
      }
      this.addIntersection_(
          intersections, weatherRange.getRange(), fish.getPreviousTimeRange());
      this.addIntersection_(
          intersections, weatherRange.getRange(), fish.getNextTimeRange());
    }, this);

    fish.setCatchableRanges(intersections);

  }, this);

  // TODO If the set of fish that is catchable has changed, dispatch an event.
  //this.dispatchEvent(ff.service.FishWatcher.EventType.CATCHABLE_SET_CHANGED);
};


/**
 * Figures out if there is an intersection of the two ranges and adds it to the
 * list of intersections.  If the ranges only intersect on a single point, it
 * is *not* considered an intersection.
 * @param {!Array.<!goog.math.Range>} intersections
 * @param {!goog.math.Range} range1
 * @param {!goog.math.Range} range2
 * @private
 */
ff.service.FishWatcher.prototype.addIntersection_ = function(
    intersections, range1, range2) {
  var intersection = goog.math.Range.intersection(range1, range2);
  if (intersection && intersection.getLength() > 0) {
    intersections.push(intersection);
  }
};
