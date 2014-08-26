/**
 * The top level component for the home page.
 */

goog.provide('ff.fisher.ui.FishTable');

goog.require('ff.fisher.ui.FishRow');
goog.require('ff.service.FishService');
goog.require('goog.array');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.FishTable = function() {
  goog.base(this);

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();
};
goog.inherits(ff.fisher.ui.FishTable, goog.ui.Component);


/** @override */
ff.fisher.ui.FishTable.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.fishService_.getAll().addCallback(
      goog.bind(this.renderFish_, this));
};


/**
 * @param {!Array.<!ff.model.Fish>} fishes The fishes to render.
 * @private
 */
ff.fisher.ui.FishTable.prototype.renderFish_ = function(fishes) {
  // Clear existing fish.
  goog.disposeAll(this.removeChildren(true));

  // Render the fish.
  goog.array.forEach(fishes, function(fish) {
    var fishRow = new ff.fisher.ui.FishRow(fish);
    this.addChild(fishRow);
    fishRow.render(this.getElement());
  }, this);
};
