/**
 * A container for various UI state.
 */

goog.provide('ff.fisher.ui.State');

goog.require('ff.model.Area');
goog.require('ff.model.AreaEnum');
goog.require('goog.events.EventTarget');
goog.require('goog.log');
goog.require('goog.object');



/**
 * Keeps track of UI state and dispatches events when it changes.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ff.fisher.ui.State = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.State');

  /**
   * Keeps track of an area's collapsed state.
   * @type {!Object.<string, boolean>}
   * @private
   */
  this.areaCollapseMap_ = {};

  // TODO Read the state from a cookie.
  // No area is collapsed by default.
  goog.object.forEach(
      ff.model.AreaEnum,
      function(area, key, obj) {
        this.areaCollapseMap_[key] = false;
      },
      this);
};
goog.inherits(ff.fisher.ui.State, goog.events.EventTarget);
goog.addSingletonGetter(ff.fisher.ui.State);


/**
 * Checks if the given area is collapsed or not.
 * @param {!ff.model.Area} area
 * @return {boolean}
 */
ff.fisher.ui.State.prototype.isAreaCollapsed = function(area) {
  var areaEnum = ff.model.Area.getEnum(area);
  return this.areaCollapseMap_[areaEnum];
};


/**
 * Collapses or expands the given area.
 * @param {!ff.model.Area} area
 */
ff.fisher.ui.State.prototype.toggleAreaCollapsed = function(area) {
  var areaEnum = ff.model.Area.getEnum(area);

  // TODO Save state to a cookie.
  this.areaCollapseMap_[areaEnum] = !this.areaCollapseMap_[areaEnum];
};
