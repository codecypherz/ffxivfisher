/**
 * Renders fish for a single area.
 */

goog.provide('ff.fisher.ui.all.AllFish');

goog.require('ff.fisher.ui.all.soy');
goog.require('ff.fisher.ui.fish.FishRow');
goog.require('ff.service.FishService');
goog.require('ff.service.FishWatcher');
goog.require('goog.array');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.all.AllFish = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.all.AllFish');

  /** @private {!Array.<!ff.fisher.ui.fish.FishRow>} */
  this.fishRows_ = [];

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();

  /** @private {!ff.service.FishWatcher} */
  this.fishWatcher_ = ff.service.FishWatcher.getInstance();
};
goog.inherits(ff.fisher.ui.all.AllFish, goog.ui.Component);


/** @override */
ff.fisher.ui.all.AllFish.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.all.soy.ALL_FISH, {
      }));

  this.renderFish_();
};


/** @override */
ff.fisher.ui.all.AllFish.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(
      this.fishWatcher_,
      ff.service.FishWatcher.EventType.CATCHABLE_SET_CHANGED,
      this.renderFish_);
};


/**
 * Renders all of the fish.
 * @private
 */
ff.fisher.ui.all.AllFish.prototype.renderFish_ = function() {

  // Clear existing fish.
  goog.array.forEach(this.fishRows_, function(fishRow) {
    this.removeChild(fishRow, true);
    goog.dispose(fishRow);
  }, this);
  this.fishRows_ = [];

  var fishRowsElement = this.getElement();

  // Sort the fish.
  var fishes = this.fishService_.getAll();
  this.fishService_.sortByNextCatch(fishes);

  // Render the fish.
  goog.array.forEach(fishes, function(fish) {
    var fishRow = new ff.fisher.ui.fish.FishRow(fish);
    this.fishRows_.push(fishRow);
    this.addChild(fishRow);
    fishRow.render(fishRowsElement);
  }, this);
};
