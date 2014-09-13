/**
 * A common timer that UI components should use to update themselves regularly.
 */

goog.provide('ff.fisher.ui.UpdateTimer');

goog.require('goog.Timer');
goog.require('goog.events.EventTarget');
goog.require('goog.log');



/**
 * A common timer that fires when the UI should update itself.  It's loosely
 * based pixels per Eorzean minute on a 300 pixel width rectangle representing
 * a single day.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ff.fisher.ui.UpdateTimer = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.UpdateTimer');

  /** @private {!goog.Timer} */
  this.timer_ = new goog.Timer(ff.fisher.ui.UpdateTimer.UPDATE_INTERVAL_MS_);
  this.registerDisposable(this.timer_);

  this.timer_.setParentEventTarget(this);
  this.timer_.start();
  this.timer_.dispatchTick();
};
goog.inherits(ff.fisher.ui.UpdateTimer, goog.events.EventTarget);
goog.addSingletonGetter(ff.fisher.ui.UpdateTimer);


/**
 * @type {number}
 * @const
 * @private
 */
ff.fisher.ui.UpdateTimer.UPDATE_INTERVAL_MS_ = 3000;
