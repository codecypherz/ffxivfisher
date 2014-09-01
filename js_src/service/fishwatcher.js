/**
 * Service for watching which fish can be caught right now.
 */

goog.provide('ff.service.FishWatcher');

goog.require('ff');
goog.require('ff.service.EorzeaTime');
goog.require('ff.service.FishService');
goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.log');



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
  var utcDate = this.eorzeaTime_.getUtcDate();
  goog.array.forEach(this.fishService_.getAll(), function(fish) {
    fish.setCatchable(this.isCatchable_(fish, utcDate.getUTCHours()));
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
  return (fish.getStartHour() <= currentHour) &&
      (currentHour <= fish.getEndHour());
};
