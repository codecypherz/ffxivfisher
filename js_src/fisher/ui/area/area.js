/**
 * Renders fish for a single area.
 */

goog.provide('ff.fisher.ui.area.Area');

goog.require('ff');
goog.require('ff.fisher.ui.State');
goog.require('ff.fisher.ui.area.AreaWeather');
goog.require('ff.fisher.ui.area.soy');
goog.require('ff.fisher.ui.fish.FishRow');
goog.require('ff.service.EorzeaTime');
goog.require('ff.service.FishService');
goog.require('ff.service.FishWatcher');
goog.require('ff.ui');
goog.require('goog.array');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
goog.require('goog.log');
goog.require('goog.math.Range');
goog.require('goog.soy');
goog.require('goog.style');
goog.require('goog.ui.Component');



/**
 * @param {!ff.model.Area} area
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.area.Area = function(area) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.area.Area');

  /** @private {!ff.model.Area} */
  this.area_ = area;

  /** @private {!Array.<!ff.fisher.ui.fish.FishRow>} */
  this.fishRows_ = [];

  /** @private {!ff.service.EorzeaTime} */
  this.eorzeaTime_ = ff.service.EorzeaTime.getInstance();

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();

  /** @private {!ff.service.FishWatcher} */
  this.fishWatcher_ = ff.service.FishWatcher.getInstance();

  /** @private {!ff.fisher.ui.State} */
  this.uiState_ = ff.fisher.ui.State.getInstance();

  /** @private {!ff.fisher.ui.area.AreaWeather} */
  this.weather_ = new ff.fisher.ui.area.AreaWeather(this.area_);
  this.addChild(this.weather_);
};
goog.inherits(ff.fisher.ui.area.Area, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.area.Area.Id_ = {
  FISH_ROWS: ff.getUniqueId('fish-rows'),
  NAME: ff.getUniqueId('name'),
  WEATHER: ff.getUniqueId('weather')
};


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.area.Area.Css_ = {
  COLLAPSED: goog.getCssName('ff-fisher-area-collapsed')
};


/** @override */
ff.fisher.ui.area.Area.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.area.soy.AREA, {
        ids: this.makeIds(ff.fisher.ui.area.Area.Id_),
        name: this.area_.getName()
      }));

  this.weather_.render(ff.ui.getElementByFragment(
      this, ff.fisher.ui.area.Area.Id_.WEATHER));

  this.renderFish_();
};


/** @override */
ff.fisher.ui.area.Area.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(
      ff.ui.getElementByFragment(this, ff.fisher.ui.area.Area.Id_.NAME),
      goog.events.EventType.CLICK,
      this.toggleCollapsed_);

  // TODO Listen to the state class to know when to update expand/collapse.

  this.getHandler().listen(
      this.fishWatcher_,
      ff.service.FishWatcher.EventType.CATCHABLE_SET_CHANGED,
      this.renderFish_);

  this.renderFish_();
};


/**
 * Toggles the collapsed state of this area.
 * @private
 */
ff.fisher.ui.area.Area.prototype.toggleCollapsed_ = function() {
  this.uiState_.toggleAreaCollapsed(this.area_);
  this.renderFish_();
};


/**
 * Renders the fish in this area.
 * @private
 */
ff.fisher.ui.area.Area.prototype.renderFish_ = function() {

  // Clear existing fish.
  goog.array.forEach(this.fishRows_, function(fishRow) {
    this.removeChild(fishRow, true);
    goog.dispose(fishRow);
  }, this);
  this.fishRows_ = [];

  var collapsed = this.uiState_.isAreaCollapsed(this.area_);

  goog.dom.classlist.enable(
      this.getElement(),
      ff.fisher.ui.area.Area.Css_.COLLAPSED,
      collapsed);

  // If collapsed, don't render any fish.
  if (collapsed) {
    return;
  }

  var fishRowsElement = ff.ui.getElementByFragment(
      this, ff.fisher.ui.area.Area.Id_.FISH_ROWS);

  // Sort the fish.
  var fishes = this.fishService_.getForArea(this.area_);
  goog.array.stableSort(fishes, goog.bind(this.byNextCatch_, this));

  // Render the fish.
  goog.array.forEach(fishes, function(fish) {
    var fishRow = new ff.fisher.ui.fish.FishRow(fish);
    this.fishRows_.push(fishRow);
    this.addChild(fishRow);
    fishRow.render(fishRowsElement);
  }, this);

  // Hide the component if there are no fish.
  goog.style.setElementShown(this.getElement(), fishes.length > 0);
};


/**
 * Compares the two fish for the purpose of sorting such that the fish that can
 * be caught next is at the beginning.
 * @param {!ff.model.Fish} f1
 * @param {!ff.model.Fish} f2
 * @return {number}
 * @private
 */
ff.fisher.ui.area.Area.prototype.byNextCatch_ = function(f1, f2) {
  var r1 = this.getFirstVisibleRange_(f1);
  var r2 = this.getFirstVisibleRange_(f2);
  if (r1 && r2) {
    // Compare the ranges such that the earlier one comes first.
    return r1.start - r2.start;
  } else if (r1 && !r2) {
    // Fish 1 is catchable but fish 2 is not.
    return -1;
  } else if (!r1 && r2) {
    // Fish 2 is catchable but fish 1 is not.
    return 1;
  }
  // Neither fish is catchable.
  return 0;
};


/**
 * Finds the first range which either overlaps now or starts in the future.
 * @param {!ff.model.Fish} fish
 * @return {goog.math.Range}
 * @private
 */
ff.fisher.ui.area.Area.prototype.getFirstVisibleRange_ = function(fish) {
  if (!fish.isCatchable()) {
    return null;
  }
  var currentTime = this.eorzeaTime_.getCurrentEorzeaDate().getTime();
  return goog.array.find(fish.getCatchableRanges(), function(range) {
    return goog.math.Range.containsPoint(range, currentTime) ||
        range.start > currentTime;
  });
};
