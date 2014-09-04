/**
 * Renders a tooltip for the fish time component.
 */

goog.provide('ff.fisher.ui.FishTimeTooltip');

goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.positioning.Corner');
goog.require('goog.ui.Tooltip');



/**
 * @param {Element} element
 * @constructor
 * @extends {goog.ui.Tooltip}
 */
ff.fisher.ui.FishTimeTooltip = function(element) {
  goog.base(this, element);

  this.setShowDelayMs(0);
};
goog.inherits(ff.fisher.ui.FishTimeTooltip, goog.ui.Tooltip);


/** @override */
ff.fisher.ui.FishTimeTooltip.prototype.getPositioningStrategy = function(
    activationType) {
  return new ff.fisher.ui.FishTimeTooltip.Position(this.getActiveElement());
};



/**
 * @param {Element} element
 * @constructor
 * @extends {goog.positioning.AnchoredPosition}
 */
ff.fisher.ui.FishTimeTooltip.Position = function(element) {
  goog.positioning.AnchoredPosition.call(this, element,
      goog.positioning.Corner.TOP_RIGHT);
};
goog.inherits(ff.fisher.ui.FishTimeTooltip.Position,
              goog.positioning.AnchoredPosition);
