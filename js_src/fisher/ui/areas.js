/**
 * Renders fish for a single area.
 */

goog.provide('ff.fisher.ui.Areas');

goog.require('ff.fisher.ui.Area');
goog.require('ff.fisher.ui.soy');
goog.require('ff.model.AreaEnum');
goog.require('goog.array');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.Areas = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.Areas');

  /** @private {!Array.<!ff.fisher.ui.Area>} */
  this.areas_ = [];
  goog.object.forEach(
      ff.model.AreaEnum,
      function(area, key, obj) {
        var areaComponent = new ff.fisher.ui.Area(area);
        this.addChild(areaComponent);
        this.areas_.push(areaComponent);
      },
      this);
};
goog.inherits(ff.fisher.ui.Areas, goog.ui.Component);


/** @override */
ff.fisher.ui.Areas.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.soy.AREAS, { }));

  goog.array.forEach(this.areas_, function(area) {
    area.render(this.getElement());
  }, this);
};
