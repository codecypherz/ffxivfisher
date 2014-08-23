/**
 * The top level component for the home page.
 */

goog.provide('ff.home.ui.Root');

goog.require('ff.service.Fish');
goog.require('goog.array');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.home.ui.Root = function() {
  goog.base(this);

  /** @private {!ff.service.Fish} */
  this.fishService_ = ff.service.Fish.getInstance();
};
goog.inherits(ff.home.ui.Root, goog.ui.Component);


/** @override */
ff.home.ui.Root.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.fishService_.getAll().addCallback(
      goog.bind(this.renderFish_, this));
};


/**
 * @param {!Array.<!ff.model.Fish>} fishes The fishes to render.
 * @private
 */
ff.home.ui.Root.prototype.renderFish_ = function(fishes) {
  // Clear existing fish.
  //goog.disposeAll(this.removeChildren(true));
  this.getElement().innerHTML = '';

  // Render the fish.
  goog.array.forEach(fishes, function(fish) {
    // TODO Create a FishComponent.
    this.getElement().innerHTML += '<div>' + fish.getName() + '</div></br>';
  }, this);
};
