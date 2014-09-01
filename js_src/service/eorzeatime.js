/**
 * Service for dealing with time.
 */

goog.provide('ff.service.EorzeaTime');

goog.require('goog.Timer');
goog.require('goog.date.UtcDateTime');
goog.require('goog.events.EventTarget');
goog.require('goog.log');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ff.service.EorzeaTime = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.service.EorzeaTime');

  /** @private {!goog.Timer} */
  this.timer_ = new goog.Timer(1000);
  this.registerDisposable(this.timer_);

  this.timer_.setParentEventTarget(this);
  this.timer_.start();
};
goog.inherits(ff.service.EorzeaTime, goog.events.EventTarget);
goog.addSingletonGetter(ff.service.EorzeaTime);


/**
 * Ratio used to convert Earth time to Eorzean time.
 * @type {number}
 * @const
 * @private
 */
ff.service.EorzeaTime.EARTH_TO_EORZEA_ =
    3600 / // Eorzean seconds in an hour.
    175; // Earth seconds.


/**
 * Gets the current time in Eorzea as UTC milliseconds since epoc.
 * @return {number}
 */
ff.service.EorzeaTime.prototype.getUtcMs = function() {
  return new goog.date.UtcDateTime().getTime() *
      ff.service.EorzeaTime.EARTH_TO_EORZEA_;
};


/**
 * Gets the current time in Eorzea as a UTC date.
 * @return {!goog.date.UtcDateTime}
 */
ff.service.EorzeaTime.prototype.getUtcDate = function() {
  return goog.date.UtcDateTime.fromTimestamp(this.getUtcMs());
};
