/**
 * Renders fish for a single area.
 */

goog.provide('ff.fisher.ui.Area');

goog.require('ff');
goog.require('ff.fisher.ui.FishRow');
goog.require('ff.fisher.ui.soy');
goog.require('ff.service.FishService');
goog.require('ff.service.FishWatcher');
goog.require('ff.ui');
goog.require('goog.array');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @param {!ff.model.Area} area
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.Area = function(area) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.Area');

  /** @private {!ff.model.Area} */
  this.area_ = area;

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();

  /** @private {!ff.service.FishWatcher} */
  this.fishWatcher_ = ff.service.FishWatcher.getInstance();
};
goog.inherits(ff.fisher.ui.Area, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.Area.Id_ = {
  FISH_ROWS: ff.getUniqueId('fish-rows')
};


/** @override */
ff.fisher.ui.Area.prototype.createDom = function() {
  // Render soy template.
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.soy.AREA, {
        ids: this.makeIds(ff.fisher.ui.Area.Id_),
        name: this.area_.getName()
      }));

  this.renderFish_();
};


/** @override */
ff.fisher.ui.Area.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  // Listen for fish updates.
  this.getHandler().listen(
      this.fishService_,
      ff.service.FishService.EventType.FISH_CHANGED,
      this.renderFish_);

  this.getHandler().listen(
      this.fishWatcher_,
      ff.service.FishWatcher.EventType.CATCHABLE_SET_CHANGED,
      this.renderFish_);
};


/**
 * Renders the fish in this area.
 * @private
 */
ff.fisher.ui.Area.prototype.renderFish_ = function() {
  var fishes = this.fishService_.getForArea(this.area_);

  // Clear existing fish.
  goog.disposeAll(this.removeChildren(true));

  var fishRowsElement = ff.ui.getElementByFragment(
      this, ff.fisher.ui.Area.Id_.FISH_ROWS);

  // Render the fish.
  goog.array.forEach(fishes, function(fish) {
    var fishRow = new ff.fisher.ui.FishRow(fish);
    this.addChild(fishRow);
    fishRow.render(fishRowsElement);
  }, this);
};
