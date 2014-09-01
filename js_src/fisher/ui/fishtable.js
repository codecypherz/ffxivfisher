/**
 * The component that contains fish rows.
 */

goog.provide('ff.fisher.ui.FishTable');

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
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.FishTable = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.FishTable');

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();

  /** @private {!ff.service.FishWatcher} */
  this.fishWatcher_ = ff.service.FishWatcher.getInstance();
};
goog.inherits(ff.fisher.ui.FishTable, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.FishTable.Id_ = {
  FISH_ROWS: ff.getUniqueId('fish-rows')
};


/** @override */
ff.fisher.ui.FishTable.prototype.createDom = function() {
  // Render soy template.
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.soy.FISH_TABLE, {
        ids: this.makeIds(ff.fisher.ui.FishTable.Id_)
      }));

  this.renderFish_();
};


/** @override */
ff.fisher.ui.FishTable.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

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
 * @private
 */
ff.fisher.ui.FishTable.prototype.renderFish_ = function() {
  this.logger.info('Rendering fish.');
  var fishes = this.fishService_.getAll();

  // Clear existing fish.
  goog.disposeAll(this.removeChildren(true));

  var fishRowsElement = ff.ui.getElementByFragment(
      this, ff.fisher.ui.FishTable.Id_.FISH_ROWS);

  // Render the fish.
  goog.array.forEach(fishes, function(fish) {
    var fishRow = new ff.fisher.ui.FishRow(fish);
    this.addChild(fishRow);
    fishRow.render(fishRowsElement);
  }, this);
};
