/**
 * The top level component for the home page.
 */

goog.provide('ff.fisher.ui.Root');

goog.require('ff.service.FishService');
goog.require('goog.array');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.Root = function() {
  goog.base(this);

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();
};
goog.inherits(ff.fisher.ui.Root, goog.ui.Component);


/** @override */
ff.fisher.ui.Root.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.fishService_.getAll().addCallback(
      goog.bind(this.renderFish_, this));
};


/**
 * @param {!Array.<!ff.model.Fish>} fishes The fishes to render.
 * @private
 */
ff.fisher.ui.Root.prototype.renderFish_ = function(fishes) {
  // Clear existing fish.
  //goog.disposeAll(this.removeChildren(true));
  this.getElement().innerHTML = '';

  // Render the fish.
  goog.array.forEach(fishes, function(fish) {
    // TODO Create a FishComponent.
    this.getElement().innerHTML += '<div>' + fish.getName() + '</div></br>';
  }, this);
};
