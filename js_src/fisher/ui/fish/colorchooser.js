/**
 * Renders the current color for the fish.
 */

goog.provide('ff.fisher.ui.fish.ColorChooser');

goog.require('ff.fisher.ui.fish.soy');
goog.require('goog.events.EventType');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @param {!ff.model.Fish} fish
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.fish.ColorChooser = function(fish) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.fish.ColorChooser');

  /** @private {!ff.model.Fish} */
  this.fish_ = fish;
};
goog.inherits(ff.fisher.ui.fish.ColorChooser, goog.ui.Component);


/** @override */
ff.fisher.ui.fish.ColorChooser.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.fish.soy.COLOR_CHOOSER, { }));
};


/** @override */
ff.fisher.ui.fish.ColorChooser.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(
      this.getElement(),
      goog.events.EventType.CLICK,
      function(e) {
        // TODO Show palette and set color on fish - save as a cookie.
        console.info('clicked color chooser for ' + this.fish_.getName());
      });
};
