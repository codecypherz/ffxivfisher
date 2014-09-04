/**
 * Renders a time component.
 */

goog.provide('ff.fisher.ui.FishTime');

goog.require('ff');
goog.require('ff.fisher.ui.FishTimeTooltip');
goog.require('ff.fisher.ui.soy');
goog.require('ff.service.EorzeaTime');
goog.require('ff.ui');
goog.require('goog.Timer');
goog.require('goog.date.DateTime');
goog.require('goog.date.Interval');
goog.require('goog.events.EventType');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.math');
goog.require('goog.soy');
goog.require('goog.style');
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

  /** @private {ff.fisher.ui.FishTimeTooltip} */
  this.tooltip_ = null;
};
goog.inherits(ff.fisher.ui.FishTime, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.FishTime.Id_ = {
  CURRENT_TIME: ff.getUniqueId('current-time'),
  CURSOR_TIME: ff.getUniqueId('cursor-time'),
  RANGE: ff.getUniqueId('range'),
  RANGE_WRAP: ff.getUniqueId('range-wrap')
};


/**
 * The format to display the time.
 * @type {!goog.i18n.DateTimeFormat}
 * @private
 * @const
 */
ff.fisher.ui.FishTime.FORMAT_ = new goog.i18n.DateTimeFormat('hh:mm a');


/** @override */
ff.fisher.ui.FishTime.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.soy.FISH_TIME, {
        ids: this.makeIds(ff.fisher.ui.FishTime.Id_)
      }));

  var wrapAround = this.endHour_ < this.startHour_;
  var rangeElement = ff.ui.getElementByFragment(
      this, ff.fisher.ui.FishTime.Id_.RANGE);
  var rangeWrapElement = ff.ui.getElementByFragment(
      this, ff.fisher.ui.FishTime.Id_.RANGE_WRAP);
  goog.style.setElementShown(rangeWrapElement, wrapAround);
  if (wrapAround) {
    this.renderRange_(rangeElement, 0, this.endHour_);
    this.renderRange_(rangeWrapElement, this.startHour_, 23);
  } else {
    this.renderRange_(rangeElement, this.startHour_, this.endHour_);
  }
};


/** @override */
ff.fisher.ui.FishTime.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.tooltip_ = new ff.fisher.ui.FishTimeTooltip(this.getElement());

  this.getHandler().listen(
      this.getElement(),
      goog.events.EventType.MOUSEOUT,
      function(e) {
        this.updateCursorTime_(false, e);
      });
  this.getHandler().listen(
      this.getElement(),
      goog.events.EventType.MOUSEMOVE,
      function(e) {
        this.updateCursorTime_(true, e);
      });

  this.getHandler().listen(
      this.eorzeaTime_,
      goog.Timer.TICK,
      this.updateCurrentTime_);

  this.updateCurrentTime_();
  this.updateCursorTime_(false);
};


/** @override */
ff.fisher.ui.FishTime.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  goog.dispose(this.tooltip_);
  this.tooltip_ = null;
};


/**
 * Renders the range for the given interval.
 * @param {Element} range
 * @param {number} startHour
 * @param {number} endHour
 * @private
 */
ff.fisher.ui.FishTime.prototype.renderRange_ = function(
    range, startHour, endHour) {
  range.style.left = ((startHour / 24.0) * 100) + '%';
  range.style.right = (((23 - endHour) / 24.0) * 100) + '%';
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
  var percent = this.getXPercentForEorzeaDate_(
      this.eorzeaTime_.getCurrentEorzeaDate());
  currentTimeElement.style.left = (percent * 100) + '%';
};


/**
 * @param {boolean} visible
 * @param {goog.events.BrowserEvent=} opt_e
 * @private
 */
ff.fisher.ui.FishTime.prototype.updateCursorTime_ = function(visible, opt_e) {
  var cursorTimeElement = ff.ui.getElementByFragment(
      this, ff.fisher.ui.FishTime.Id_.CURSOR_TIME);
  goog.style.setElementShown(cursorTimeElement, visible);

  if (!visible || !goog.isDefAndNotNull(opt_e)) {
    return;
  }

  // Figure out where in the element we are.
  var timePos = goog.style.getClientPosition(this.getElement());
  var x = opt_e.clientX - timePos.x;
  var width = this.getElement().offsetWidth;

  var percent = goog.math.clamp(x / width, 0, 1);
  cursorTimeElement.style.left = (percent * 100) + '%';

  // Figure out the Eorzea date corresponding to the percent.
  var eorzeaDate = this.eorzeaTime_.getCurrentEorzeaDate();
  var currentTimePercent = this.getXPercentForEorzeaDate_(eorzeaDate);
  var deltaEorzeaHours = (percent - currentTimePercent) * 24.0;
  eorzeaDate.add(new goog.date.Interval(0, 0, 0, deltaEorzeaHours));
  var eorzeaString = ff.fisher.ui.FishTime.FORMAT_.format(eorzeaDate);

  // Figure out the Earth date based on the Eorzea date.
  var earthUtcDate = this.eorzeaTime_.toEarth(eorzeaDate);
  var earthDate = goog.date.DateTime.fromTimestamp(earthUtcDate.getTime());
  var earthString = ff.fisher.ui.FishTime.FORMAT_.format(earthDate);

  this.tooltip_.setHtml(
      eorzeaString + ' (Eorzea)<br>' +
      earthString + ' (Earth)');
};


/**
 * @param {!goog.date.UtcDateTime} eorzeaDate
 * @return {number}
 * @private
 */
ff.fisher.ui.FishTime.prototype.getXPercentForEorzeaDate_ = function(
    eorzeaDate) {
  var time = eorzeaDate.getUTCHours() + (eorzeaDate.getUTCMinutes() / 60.0);
  return (time / 24.0);
};
