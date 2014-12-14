/**
 * Renders fish for a single area.
 */

goog.provide('ff.fisher.ui.area.Area');

goog.require('ff');
goog.require('ff.fisher.ui.State');
goog.require('ff.fisher.ui.area.soy');
goog.require('ff.fisher.ui.fish.FishRow');
goog.require('ff.model.Fish');
goog.require('ff.service.FishService');
goog.require('ff.service.FishWatcher');
goog.require('ff.ui');
goog.require('ff.ui.Css');
goog.require('goog.array');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.log');
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

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();

  /** @private {!ff.service.FishWatcher} */
  this.fishWatcher_ = ff.service.FishWatcher.getInstance();

  /** @private {!ff.fisher.ui.State} */
  this.uiState_ = ff.fisher.ui.State.getInstance();

  /** @private {!goog.events.EventHandler} */
  this.fishHandler_ = new goog.events.EventHandler(this);
};
goog.inherits(ff.fisher.ui.area.Area, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.area.Area.Id_ = {
  FISH_ROWS: ff.getUniqueId('fish-rows'),
  NAME: ff.getUniqueId('name')
};


/** @override */
ff.fisher.ui.area.Area.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.area.soy.AREA, {
        ids: this.makeIds(ff.fisher.ui.area.Area.Id_),
        name: this.area_.getName()
      }));

  this.renderFish_();
};


/** @override */
ff.fisher.ui.area.Area.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(
      ff.ui.getElementByFragment(this, ff.fisher.ui.area.Area.Id_.NAME),
      goog.events.EventType.CLICK,
      function() {
        this.uiState_.toggleAreaCollapsed(this.area_);
      });

  this.getHandler().listen(
      this.uiState_,
      ff.fisher.ui.State.EventType.COLLAPSE_CHANGED,
      function(e) {
        if (e.area == this.area_) {
          this.renderFish_();
        }
      });

  this.getHandler().listen(
      this.fishWatcher_,
      ff.service.FishWatcher.EventType.CATCHABLE_SET_CHANGED,
      this.renderFish_);

  this.getHandler().listen(
      this.uiState_,
      ff.fisher.ui.State.EventType.FILTER_CHANGED,
      this.renderFish_);
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
  this.fishHandler_.removeAll();

  var collapsed = this.uiState_.isAreaCollapsed(this.area_);

  goog.dom.classlist.enable(this.getElement(), ff.ui.Css.COLLAPSED, collapsed);

  var fishRowsElement = ff.ui.getElementByFragment(
      this, ff.fisher.ui.area.Area.Id_.FISH_ROWS);

  // Sort the fish.
  var fishes = this.fishService_.getForArea(this.area_);
  this.fishService_.sortByNextCatch(fishes);

  // Render the fish.
  goog.array.forEach(fishes, function(fish) {
    var fishRow = new ff.fisher.ui.fish.FishRow(fish);
    this.fishRows_.push(fishRow);
    this.addChild(fishRow);
    fishRow.render(fishRowsElement);

    // Update the visibility of the area component if the fish changes color
    // in case the filter is such that this would remove the last visible fish.
    this.fishHandler_.listen(
        fish, ff.model.Fish.EventType.COLOR_CHANGED, this.updateVisibility_);

  }, this);

  this.updateVisibility_();
};


/**
 * Updates this area's visibility.
 * @private
 */
ff.fisher.ui.area.Area.prototype.updateVisibility_ = function() {
  var fishes = this.fishService_.getForArea(this.area_);

  var filterCount = 0;
  goog.array.forEach(fishes, function(fish) {
    if (this.uiState_.isFiltered(fish)) {
      filterCount++;
    }
  }, this);

  // Hide the component if there are no fish or if all fish are filtered.
  var showComponent = (fishes.length > 0) && (filterCount != fishes.length);
  goog.style.setElementShown(this.getElement(), showComponent);
};
