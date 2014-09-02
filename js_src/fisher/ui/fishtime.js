/**
 * Renders a time component.
 */

goog.provide('ff.fisher.ui.FishTime');

goog.require('ff');
goog.require('ff.fisher.ui.soy');
goog.require('ff.service.EorzeaTime');
goog.require('ff.ui');
goog.require('goog.Timer');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @param {number} startHour
 * @param {number} endHour
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.FishTime = function(startHour, endHour) {
  goog.base(this);

  /** @private {number} */
  this.startHour_ = startHour;

  /** @private {number} */
  this.endHour_ = endHour;

  /** @private {!ff.service.EorzeaTime} */
  this.eorzeaTime_ = ff.service.EorzeaTime.getInstance();
};
goog.inherits(ff.fisher.ui.FishTime, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.FishTime.Id_ = {
  CURRENT_TIME: ff.getUniqueId('current-time'),
  RANGE: ff.getUniqueId('range')
};


/** @override */
ff.fisher.ui.FishTime.prototype.createDom = function() {
  var tooltip = this.formatHour_(this.startHour_) +
      ' - ' + this.formatHour_(this.endHour_ + 1);
  if (this.startHour_ == 0 && this.endHour_ == 23) {
    tooltip = 'All day';
  }

  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.soy.FISH_TIME, {
        ids: this.makeIds(ff.fisher.ui.FishTime.Id_),
        tooltip: tooltip
      }));

  // Update the bounds of the range element.
  var rangeElement = ff.ui.getElementByFragment(
      this, ff.fisher.ui.FishTime.Id_.RANGE);
  rangeElement.style.left = ((this.startHour_ / 24.0) * 100) + '%';
  rangeElement.style.right = (((23 - this.endHour_) / 24.0) * 100) + '%';
};


/** @override */
ff.fisher.ui.FishTime.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(
      this.eorzeaTime_,
      goog.Timer.TICK,
      this.updateCurrentTime_);

  this.updateCurrentTime_();
};


/**
 * Updates the widget to reflect the current time.
 * @private
 */
ff.fisher.ui.FishTime.prototype.updateCurrentTime_ = function() {
  if (!this.isInDocument()) {
    return;
  }

  var currentTimeElement = ff.ui.getElementByFragment(
      this, ff.fisher.ui.FishTime.Id_.CURRENT_TIME);
  var date = this.eorzeaTime_.getCurrentEorzeaDate();
  var time = date.getUTCHours() + (date.getUTCMinutes() / 60.0);
  currentTimeElement.style.left = (time / 24.0) * 100 + '%';
};


/**
 * Formats the hour in a way that is readable.
 * @param {number} hour
 * @return {string}
 * @private
 */
ff.fisher.ui.FishTime.prototype.formatHour_ = function(hour) {
  var amPm = hour > 12 ? 'pm' : 'am';
  if (hour == 24) {
    hour = 12;
    amPm = 'am';
  }
  if (hour == 0) {
    hour = 12;
  }
  if (hour > 12) {
    hour = 24 - hour;
  }
  return hour + ':00 ' + amPm;
};
