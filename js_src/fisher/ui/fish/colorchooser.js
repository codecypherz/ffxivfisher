/**
 * Renders the current color for the fish.
 */

goog.provide('ff.fisher.ui.fish.ColorChooser');

goog.require('ff');
goog.require('ff.fisher.ui.fish.soy');
goog.require('ff.model.Fish');
goog.require('ff.ui');
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

  /** @private {Element} */
  this.oneElement_ = null;

  /** @private {Element} */
  this.twoElement_ = null;

  /** @private {Element} */
  this.threeElement_ = null;

  /** @private {Element} */
  this.clearElement_ = null;
};
goog.inherits(ff.fisher.ui.fish.ColorChooser, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.fish.ColorChooser.Id_ = {
  CLEAR: ff.getUniqueId('clear'),
  ONE: ff.getUniqueId('one'),
  TWO: ff.getUniqueId('two'),
  THREE: ff.getUniqueId('three')
};


/** @override */
ff.fisher.ui.fish.ColorChooser.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.fish.soy.COLOR_CHOOSER, {
        ids: this.makeIds(ff.fisher.ui.fish.ColorChooser.Id_)
      }));

  this.oneElement_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.ColorChooser.Id_.ONE);
  this.twoElement_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.ColorChooser.Id_.TWO);
  this.threeElement_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.ColorChooser.Id_.THREE);
  this.clearElement_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.ColorChooser.Id_.CLEAR);
};


/** @override */
ff.fisher.ui.fish.ColorChooser.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(
      this.getElement(),
      goog.events.EventType.CLICK,
      function(e) {
        if (e.target == this.oneElement_) {
          this.fish_.setUserColor(ff.model.Fish.Color.ONE);
        } else if (e.target == this.twoElement_) {
          this.fish_.setUserColor(ff.model.Fish.Color.TWO);
        } else if (e.target == this.threeElement_) {
          this.fish_.setUserColor(ff.model.Fish.Color.THREE);
        } else if (e.target == this.clearElement_) {
          this.fish_.setUserColor(ff.model.Fish.Color.CLEAR);
        }
      });
};
