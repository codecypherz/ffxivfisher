/**
 * Renders a tooltip for the fish time component.
 */

goog.provide('ff.fisher.ui.fish.FishTimeTooltip');

goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.positioning.Corner');
goog.require('goog.ui.Tooltip');



/**
 * @param {Element} element
 * @constructor
 * @extends {goog.ui.Tooltip}
 */
ff.fisher.ui.fish.FishTimeTooltip = function(element) {
  goog.base(this, element);

  this.setShowDelayMs(0);
};
goog.inherits(ff.fisher.ui.fish.FishTimeTooltip, goog.ui.Tooltip);


/** @override */
ff.fisher.ui.fish.FishTimeTooltip.prototype.getPositioningStrategy = function(
    activationType) {
  return new ff.fisher.ui.fish.FishTimeTooltip.Position(
      this.getActiveElement());
};



/**
 * @param {Element} element
 * @constructor
 * @extends {goog.positioning.AnchoredPosition}
 */
ff.fisher.ui.fish.FishTimeTooltip.Position = function(element) {
  goog.positioning.AnchoredPosition.call(this, element,
      goog.positioning.Corner.TOP_RIGHT);
};
goog.inherits(ff.fisher.ui.fish.FishTimeTooltip.Position,
              goog.positioning.AnchoredPosition);
