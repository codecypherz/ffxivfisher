/**
 * Renders the Eorzean clock.
 */

goog.provide('ff.fisher.ui.EorzeaClock');

goog.require('ff');
goog.require('ff.fisher.ui.soy');
goog.require('ff.model.EorzeaTime');
goog.require('ff.ui');
goog.require('goog.Timer');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.EorzeaClock = function() {
  goog.base(this);

  /** @private {!ff.model.EorzeaTime} */
  this.eorzeaTime_ = ff.model.EorzeaTime.getInstance();
};
goog.inherits(ff.fisher.ui.EorzeaClock, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.EorzeaClock.Id_ = {
  TIME: ff.getUniqueId('time')
};


/** @override */
ff.fisher.ui.EorzeaClock.prototype.createDom = function() {
  // Render soy template.
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.soy.EORZEA_CLOCK, {
        ids: this.makeIds(ff.fisher.ui.EorzeaClock.Id_)
      }));

  this.update_();
};


/** @override */
ff.fisher.ui.EorzeaClock.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.eorzeaTime_, goog.Timer.TICK, this.update_);
};


/**
 * Updates the clock with the current time.
 * @private
 */
ff.fisher.ui.EorzeaClock.prototype.update_ = function() {
  var timeElement = ff.ui.getElementByFragment(
      this, ff.fisher.ui.EorzeaClock.Id_.TIME);
  timeElement.innerHTML = this.eorzeaTime_.getTime();
};
