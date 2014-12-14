/**
 * Renders a time component.
 */

goog.provide('ff.fisher.ui.fish.FishTime');

goog.require('ff');
goog.require('ff.fisher.ui.UpdateTimer');
goog.require('ff.fisher.ui.fish.FishTimeTooltip');
goog.require('ff.fisher.ui.fish.soy');
goog.require('ff.model.Fish');
goog.require('ff.service.EorzeaTime');
goog.require('ff.service.WeatherService');
goog.require('ff.ui');
goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.date.DateTime');
goog.require('goog.date.Interval');
goog.require('goog.dom');
goog.require('goog.events.EventType');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.math');
goog.require('goog.math.Range');
goog.require('goog.soy');
goog.require('goog.style');
goog.require('goog.ui.Component');



/**
 * @param {!ff.model.Fish} fish
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.fish.FishTime = function(fish) {
  goog.base(this);

  /** @private {!ff.model.Fish} */
  this.fish_ = fish;

  /** @private {!ff.service.EorzeaTime} */
  this.eorzeaTime_ = ff.service.EorzeaTime.getInstance();

  /** @private {!ff.service.WeatherService} */
  this.weatherService_ = ff.service.WeatherService.getInstance();

  /** @private {!ff.fisher.ui.UpdateTimer} */
  this.updateTimer_ = ff.fisher.ui.UpdateTimer.getInstance();

  /** @private {Element} */
  this.range1_ = null;

  /** @private {Element} */
  this.range2_ = null;

  /** @private {!Array.<Element>} */
  this.catchableRangeElements_ = [];

  /** @private {Element} */
  this.weatherChange1_ = null;

  /** @private {Element} */
  this.weatherChange2_ = null;

  /** @private {Element} */
  this.weatherChange3_ = null;

  /** @private {Element} */
  this.weatherChange4_ = null;

  /** @private {Element} */
  this.weatherChange5_ = null;

  /** @private {Element} */
  this.weatherChange6_ = null;

  /** @private {Element} */
  this.cursor_ = null;

  /** @private {!ff.fisher.ui.fish.FishTimeTooltip} */
  this.tooltip_ = ff.fisher.ui.fish.FishTimeTooltip.getInstance();
};
goog.inherits(ff.fisher.ui.fish.FishTime, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.fish.FishTime.Id_ = {
  CURSOR: ff.getUniqueId('cursor'),
  EARTH_TIME: ff.getUniqueId('earth-time'),
  EORZEA_TIME: ff.getUniqueId('eorzea-time'),
  RANGE_1: ff.getUniqueId('range-1'),
  RANGE_2: ff.getUniqueId('range-2'),
  REMAINING_TIME: ff.getUniqueId('remaining-time'),
  WEATHER_CHANGE_1: ff.getUniqueId('weather-change-1'),
  WEATHER_CHANGE_2: ff.getUniqueId('weather-change-2'),
  WEATHER_CHANGE_3: ff.getUniqueId('weather-change-3'),
  WEATHER_CHANGE_4: ff.getUniqueId('weather-change-4'),
  WEATHER_CHANGE_5: ff.getUniqueId('weather-change-5'),
  WEATHER_CHANGE_6: ff.getUniqueId('weather-change-6')
};


/**
 * The format to display the time.
 * @type {!goog.i18n.DateTimeFormat}
 * @private
 * @const
 */
ff.fisher.ui.fish.FishTime.FORMAT_ = new goog.i18n.DateTimeFormat('hh:mm a');


/** @override */
ff.fisher.ui.fish.FishTime.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.fish.soy.FISH_TIME, {
        ids: this.makeIds(ff.fisher.ui.fish.FishTime.Id_)
      }));

  this.range1_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishTime.Id_.RANGE_1);
  this.range2_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishTime.Id_.RANGE_2);

  this.weatherChange1_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishTime.Id_.WEATHER_CHANGE_1);
  this.weatherChange2_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishTime.Id_.WEATHER_CHANGE_2);
  this.weatherChange3_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishTime.Id_.WEATHER_CHANGE_3);
  this.weatherChange4_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishTime.Id_.WEATHER_CHANGE_4);
  this.weatherChange5_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishTime.Id_.WEATHER_CHANGE_5);
  this.weatherChange6_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishTime.Id_.WEATHER_CHANGE_6);

  this.cursor_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishTime.Id_.CURSOR);
};


/** @override */
ff.fisher.ui.fish.FishTime.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  // Listen for cursor changes.
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
      this.getElement(),
      goog.events.EventType.CLICK,
      function(e) {
        var show = !goog.style.isElementShown(this.tooltip_.getElement());
        goog.Timer.callOnce(function() {
          this.updateCursorTime_(show, e);
        }, 0, this);
      });

  // Listen for catchable range changes.
  this.getHandler().listen(
      this.fish_,
      ff.model.Fish.EventType.CATCHABLE_CHANGED,
      this.renderCatchableRanges_);

  // Update the cursor.
  this.updateCursorTime_(false);

  // Listen for when to update.
  this.getHandler().listen(
      this.updateTimer_,
      goog.Timer.TICK,
      this.update_);

  // Update right now.
  goog.Timer.callOnce(this.renderCatchableRanges_, 0, this);
};


/** @private */
ff.fisher.ui.fish.FishTime.prototype.renderCatchableRanges_ = function() {
  if (!this.isInDocument()) {
    return;
  }

  // Clear existing elements.
  goog.array.forEach(this.catchableRangeElements_, goog.dom.removeNode);
  this.catchableRangeElements_ = [];

  // Render new ones.
  var catchableRanges = this.fish_.getCatchableRanges();
  goog.array.forEach(catchableRanges, function(catchableRange) {
    var catchableRangeElement = goog.soy.renderAsElement(
        ff.fisher.ui.fish.soy.CATCHABLE_RANGE, { });
    this.getElement().appendChild(catchableRangeElement);
    this.catchableRangeElements_.push(catchableRangeElement);
  }, this);

  // Update to position all ranges correctly.
  this.update_();
};


/**
 * Updates the widget based on the current time.
 * @private
 */
ff.fisher.ui.fish.FishTime.prototype.update_ = function() {
  if (!this.isInDocument()) {
    return;
  }

  var eorzeaDate = this.eorzeaTime_.getCurrentEorzeaDate();

  // Update the time ranges for the fish.
  this.position_(this.range1_, this.fish_.getPreviousTimeRange(), eorzeaDate);
  this.position_(this.range2_, this.fish_.getNextTimeRange(), eorzeaDate);

  // Update where weather changes will happen.
  var weatherTimeRanges = this.weatherService_.getWeatherTimeRanges();
  this.setLeft_(this.weatherChange1_, weatherTimeRanges[0], eorzeaDate);
  this.setLeft_(this.weatherChange2_, weatherTimeRanges[1], eorzeaDate);
  this.setLeft_(this.weatherChange3_, weatherTimeRanges[2], eorzeaDate);
  this.setLeft_(this.weatherChange4_, weatherTimeRanges[3], eorzeaDate);
  this.setLeft_(this.weatherChange5_, weatherTimeRanges[4], eorzeaDate);
  this.setLeft_(this.weatherChange6_, weatherTimeRanges[5], eorzeaDate);

  // Update the catchable range overlays.
  goog.array.forEach(
      this.fish_.getCatchableRanges(),
      function(catchableRange, i, arr) {
        this.position_(
            this.catchableRangeElements_[i], catchableRange, eorzeaDate);
      },
      this);
};


/**
 * Positions the element based on the given range.
 * @param {Element} el
 * @param {!goog.math.Range} range
 * @param {!goog.date.UtcDateTime} eorzeaDate
 * @private
 */
ff.fisher.ui.fish.FishTime.prototype.position_ = function(
    el, range, eorzeaDate) {
  if (!el) {
    return;
  }
  el.style.width = this.toPixels_(range.getLength()) + 'px';
  this.setLeft_(el, range, eorzeaDate);
};


/**
 * Sets the left side of the element based on the given range.
 * @param {Element} el
 * @param {!goog.math.Range} range
 * @param {!goog.date.UtcDateTime} eorzeaDate
 * @private
 */
ff.fisher.ui.fish.FishTime.prototype.setLeft_ = function(
    el, range, eorzeaDate) {
  if (!range) {
    return;
  }
  el.style.left = this.toPixels_(range.start - eorzeaDate.getTime()) + 'px';
};


/**
 * Converts milliseconds to pixels.
 * @param {number} ms
 * @return {number}
 * @private
 */
ff.fisher.ui.fish.FishTime.prototype.toPixels_ = function(ms) {
  return (ms / ff.service.EorzeaTime.MS_IN_A_DAY) * this.getWidth_();
};


/**
 * @return {number}
 * @private
 */
ff.fisher.ui.fish.FishTime.prototype.getWidth_ = function() {
  return this.getElement().offsetWidth - 2; // -2 for borders
};


/**
 * @param {boolean} visible
 * @param {goog.events.BrowserEvent=} opt_e
 * @private
 */
ff.fisher.ui.fish.FishTime.prototype.updateCursorTime_ = function(
    visible, opt_e) {
  goog.style.setElementShown(this.cursor_, visible);
  goog.style.setElementShown(this.tooltip_.getElement(), visible);

  if (!visible || !goog.isDefAndNotNull(opt_e) || !this.isInDocument()) {
    return;
  }

  // Figure out where in the element we are.
  var timePos = goog.style.getClientPosition(this.getElement());
  var x = opt_e.clientX - timePos.x;
  var percent = goog.math.clamp(x / this.getWidth_(), 0, 1);

  // Determine the closest hour.
  var currentDate = this.eorzeaTime_.getCurrentEorzeaDate();
  var eorzeaDate = currentDate.clone();
  var deltaEorzeaHours = percent * 24.0;
  eorzeaDate.add(new goog.date.Interval(0, 0, 0, deltaEorzeaHours));
  var timeForWeather = eorzeaDate.getTime();
  var hour = eorzeaDate.getHours();
  if (eorzeaDate.getMinutes() >= 30) {
    if (hour == 23) {
      // Round up to the next day.
      hour = 0;
      eorzeaDate.add(new goog.date.Interval(0, 0, 1, 0));
    } else {
      // Round up to the next hour.
      hour = (hour + 1) % 24;
    }
  }
  eorzeaDate.setHours(hour);
  eorzeaDate.setMinutes(0);

  // Update the tooltip text.
  var eorzeaString = ff.fisher.ui.fish.FishTime.FORMAT_.format(eorzeaDate);

  // Figure out the Earth date based on the Eorzea date.
  var earthUtcDate = this.eorzeaTime_.toEarth(eorzeaDate);
  var earthDate = goog.date.DateTime.fromTimestamp(earthUtcDate.getTime());
  var earthString = ff.fisher.ui.fish.FishTime.FORMAT_.format(earthDate);
  var earthMinutesToTarget = Math.round(
      (earthDate.getTime() - goog.now()) / (60 * 1000));
  var earthSecondsToTarget = Math.round(
      (earthDate.getTime() - goog.now()) / 1000);

  var timeUntilText = '';
  if (earthSecondsToTarget < 60) {
    if (earthSecondsToTarget <= 0) {
      timeUntilText = 'right now';
    } else if (earthSecondsToTarget == 1) {
      timeUntilText = 'in ' + earthSecondsToTarget + ' second';
    } else {
      timeUntilText = 'in ' + earthSecondsToTarget + ' seconds';
    }
  } else if (earthMinutesToTarget == 1) {
    timeUntilText = 'in ' + earthMinutesToTarget + ' minute';
  } else {
    timeUntilText = 'in ' + earthMinutesToTarget + ' minutes';
  }

  this.tooltip_.setText(eorzeaString, earthString, timeUntilText);

  // Figure out which weather is under the cursor.
  var area = this.fish_.getLocation().getArea();
  var weatherRange = /** @type {?ff.model.WeatherRange} */ (goog.array.find(
      this.weatherService_.getWeatherRangesForArea(area),
      function(weatherRange) {
        return goog.math.Range.containsPoint(
            weatherRange.getRange(), timeForWeather);
      }));
  var weather = weatherRange ? weatherRange.getWeather() : null;
  this.tooltip_.setWeather(weather);

  // Update positions.
  var deltaMs = eorzeaDate.getTime() - currentDate.getTime();
  var deltaPixels = this.toPixels_(deltaMs);
  this.cursor_.style.left = deltaPixels + 'px';

  var scrollPos = goog.dom.getDocumentScroll();
  var tooltipSize = goog.style.getSize(this.tooltip_.getElement());
  this.tooltip_.getElement().style.top =
      (timePos.y + scrollPos.y) + 'px';
  this.tooltip_.getElement().style.left =
      (timePos.x - (tooltipSize.width / 2) + scrollPos.x) + deltaPixels + 'px';
};
