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

  /** @private {Element} */
  this.range1_ = null;

  /** @private {Element} */
  this.range2_ = null;

  /** @private {Element} */
  this.weatherChange1_ = null;

  /** @private {Element} */
  this.weatherChange2_ = null;

  /** @private {Element} */
  this.cursor_ = null;
};
goog.inherits(ff.fisher.ui.FishTime, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.FishTime.Id_ = {
  CURSOR: ff.getUniqueId('cursor'),
  RANGE_1: ff.getUniqueId('range-1'),
  RANGE_2: ff.getUniqueId('range-2'),
  WEATHER_CHANGE_1: ff.getUniqueId('weather-change-1'),
  WEATHER_CHANGE_2: ff.getUniqueId('weather-change-2'),
  WEATHER_CHANGE_3: ff.getUniqueId('weather-change-3')
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

  this.range1_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.FishTime.Id_.RANGE_1);
  this.range2_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.FishTime.Id_.RANGE_2);
  this.weatherChange1_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.FishTime.Id_.WEATHER_CHANGE_1);
  this.weatherChange2_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.FishTime.Id_.WEATHER_CHANGE_2);
  this.weatherChange3_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.FishTime.Id_.WEATHER_CHANGE_3);
  this.cursor_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.FishTime.Id_.CURSOR);

  // Set the widths of the two ranges.
  var diff = Math.abs((this.endHour_ + 1) - this.startHour_);
  var range = this.endHour_ < this.startHour_ ? 24 - diff : diff;
  var width = (range / 24.0) * 300;
  this.range1_.style.width = width + 'px';
  this.range2_.style.width = width + 'px';
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
      this.update_);

  this.update_();
  this.updateCursorTime_(false);
};


/** @override */
ff.fisher.ui.FishTime.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  goog.dispose(this.tooltip_);
  this.tooltip_ = null;
};


/**
 * Updates the widget based on the current time.
 * @private
 */
ff.fisher.ui.FishTime.prototype.update_ = function() {
  if (!this.isInDocument()) {
    return;
  }

  var eorzeaDate = this.eorzeaTime_.getCurrentEorzeaDate();
  var currentHour =
      eorzeaDate.getUTCHours() + (eorzeaDate.getUTCMinutes() / 60.0);

  var hoursUntilNextStart = this.getHoursUntilNextHour_(
      currentHour, this.startHour_);
  this.setLeft_(this.range1_, hoursUntilNextStart);
  this.setLeft_(this.range2_, hoursUntilNextStart - 24);

  this.setLeft_(
      this.weatherChange1_, this.getHoursUntilNextHour_(currentHour, 0));
  this.setLeft_(
      this.weatherChange2_, this.getHoursUntilNextHour_(currentHour, 8));
  this.setLeft_(
      this.weatherChange3_, this.getHoursUntilNextHour_(currentHour, 16));
};


/**
 * Figures out the number of hours (including minutes) until the target appears
 * relative to the current time.
 * @param {number} current The current hours (including minutes) of the day
 *     (e.g. 4.5 is 4:30am).
 * @param {number} target The target hour.
 * @return {number} The number of hours until the target.  Never negative.
 * @private
 */
ff.fisher.ui.FishTime.prototype.getHoursUntilNextHour_ = function(
    current, target) {
  if (current <= target) {
    return target - current;
  } else {
    return 24 + target - current;
  }
};


/**
 * Sets the left side of the element relative to the current time assuming the
 * current time is at relative position 0.
 * @param {Element} el
 * @param {number} hoursFromLeft
 * @private
 */
ff.fisher.ui.FishTime.prototype.setLeft_ = function(el, hoursFromLeft) {
  var width = this.getElement().offsetWidth - 2; // -2 for borders
  var offsetPercent = hoursFromLeft / 24.0;
  var offsetInPixels = width * offsetPercent;
  el.style.left = offsetInPixels + 'px';
};


/**
 * @param {boolean} visible
 * @param {goog.events.BrowserEvent=} opt_e
 * @private
 */
ff.fisher.ui.FishTime.prototype.updateCursorTime_ = function(visible, opt_e) {
  goog.style.setElementShown(this.cursor_, visible);

  if (!visible || !goog.isDefAndNotNull(opt_e)) {
    return;
  }

  // Figure out where in the element we are.
  var timePos = goog.style.getClientPosition(this.getElement());
  var x = opt_e.clientX - timePos.x;
  var width = this.getElement().offsetWidth;

  // Update the cursor.
  var percent = goog.math.clamp(x / width, 0, 1);
  this.cursor_.style.left = x + 'px';

  // Figure out the Eorzea date corresponding to the percent of the cursor.
  var eorzeaDate = this.eorzeaTime_.getCurrentEorzeaDate();
  var deltaEorzeaHours = percent * 24.0;
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
