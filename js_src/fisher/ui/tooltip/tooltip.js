/**
 * Service for dealing with time.
 */

goog.provide('ff.fisher.ui.tooltip.Tooltip');

goog.require('ff.fisher.ui.tooltip.soy');
goog.require('goog.dom');
goog.require('goog.events.EventType');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.style');



/**
 * @constructor
 */
ff.fisher.ui.tooltip.Tooltip = function() {

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.tooltip.Tooltip');

  /** @private {Element} */
  ff.fisher.ui.tooltip.Tooltip.tooltipElement_ = goog.soy.renderAsElement(
      ff.fisher.ui.tooltip.soy.TOOLTIP, {
      });

  document.body.appendChild(ff.fisher.ui.tooltip.Tooltip.tooltipElement_);

  // Don't show it until needed.
  ff.fisher.ui.tooltip.Tooltip.hide_();
};
goog.addSingletonGetter(ff.fisher.ui.tooltip.Tooltip);


/** @private {Element} */
ff.fisher.ui.tooltip.Tooltip.tooltipElement_ = null;


/**
 * Registers an element to have a tooltip.
 * @param {!goog.events.EventHandler} handler
 * @param {Element} element
 * @param {string} text
 */
ff.fisher.ui.tooltip.Tooltip.prototype.registerElement =
    function(handler, element, text) {

  // Attach listeners.
  handler.listen(
      element,
      goog.events.EventType.MOUSEOUT,
      function(e) {
        ff.fisher.ui.tooltip.Tooltip.hide_();
      });

  handler.listen(
      element,
      [goog.events.EventType.MOUSEMOVE,
       goog.events.EventType.CLICK],
      function(e) {
        ff.fisher.ui.tooltip.Tooltip.show_(text, element);
      });
};


/**
 * Shows the tooltip.
 * @param {string} text
 * @param {Element} element
 * @private
 */
ff.fisher.ui.tooltip.Tooltip.show_ = function(text, element) {
  var tooltipElement = ff.fisher.ui.tooltip.Tooltip.tooltipElement_;
  goog.style.setElementShown(tooltipElement, true);
  goog.dom.setTextContent(tooltipElement, text);
  ff.fisher.ui.tooltip.Tooltip.updatePosition_(tooltipElement, element);
};


/**
 * Hides the tooltip.
 * @private
 */
ff.fisher.ui.tooltip.Tooltip.hide_ = function() {
  goog.style.setElementShown(
      ff.fisher.ui.tooltip.Tooltip.tooltipElement_, false);
};


/**
 * Updates the position of the tooltip.
 * @param {Element} tooltipElement
 * @param {Element} element
 * @private
 */
ff.fisher.ui.tooltip.Tooltip.updatePosition_ =
    function(tooltipElement, element) {
  // Compute sizes and positions.
  var elementPos = goog.style.getClientPosition(element);
  var elementSize = goog.style.getSize(element);
  var scrollPos = goog.dom.getDocumentScroll();
  var tooltipSize = goog.style.getSize(tooltipElement);

  tooltipElement.style.top =
      elementPos.y + scrollPos.y + elementSize.height + 2 + 'px';
  tooltipElement.style.left =
      elementPos.x + scrollPos.x - (tooltipSize.width / 2) +
      (elementSize.width / 2) + 'px';
};
