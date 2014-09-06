/**
 * Renders fish for a single area.
 */

goog.provide('ff.fisher.ui.area.Areas');

goog.require('ff.fisher.ui.area.Area');
goog.require('ff.fisher.ui.area.soy');
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
ff.fisher.ui.area.Areas = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.area.Areas');

  /** @private {!Array.<!ff.fisher.ui.area.Area>} */
  this.areas_ = [];
  goog.object.forEach(
      ff.model.AreaEnum,
      function(area, key, obj) {
        var areaComponent = new ff.fisher.ui.area.Area(area);
        this.addChild(areaComponent);
        this.areas_.push(areaComponent);
      },
      this);
};
goog.inherits(ff.fisher.ui.area.Areas, goog.ui.Component);


/** @override */
ff.fisher.ui.area.Areas.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.area.soy.AREAS, { }));

  goog.array.forEach(this.areas_, function(area) {
    area.render(this.getElement());
  }, this);
};
