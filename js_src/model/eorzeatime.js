/**
 * Service for dealing with time.
 */

goog.provide('ff.model.EorzeaTime');

goog.require('goog.Timer');
goog.require('goog.events.EventTarget');
goog.require('goog.log');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ff.model.EorzeaTime = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.model.EorzeaTime');

  /** @private {!goog.Timer} */
  this.timer_ = new goog.Timer(1000);
  this.registerDisposable(this.timer_);

  this.timer_.setParentEventTarget(this);
  this.timer_.start();
};
goog.inherits(ff.model.EorzeaTime, goog.events.EventTarget);
goog.addSingletonGetter(ff.model.EorzeaTime);


/**
 * Ratio used to convert Earth time to Eorzean time.
 * @type {number}
 * @const
 * @private
 */
ff.model.EorzeaTime.EARTH_TO_EORZEA_ =
    3600 / // Eorzean seconds in an hour.
    175; // Earth seconds.


/**
 * Gets the current time in Eorzea.
 * @return {number} The milliseconds since epoc for Eorzea.
 */
ff.model.EorzeaTime.prototype.getTime = function() {
  return new Date().getTime() * ff.model.EorzeaTime.EARTH_TO_EORZEA_;
};
