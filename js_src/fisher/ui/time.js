/**
 * Renders a time component.
 */

goog.provide('ff.fisher.ui.Time');

goog.require('goog.ui.Component');



/**
 * @param {number} startHour
 * @param {number} endHour
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.Time = function(startHour, endHour) {
  goog.base(this);

  /** @private {number} */
  this.startHour_ = startHour;

  /** @private {number} */
  this.endHour_ = endHour;
};
goog.inherits(ff.fisher.ui.Time, goog.ui.Component);


/** @override */
ff.fisher.ui.Time.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getElement().innerHTML =
      '<div>' + this.startHour_ + '-' + this.endHour_ + '</div>';
};
