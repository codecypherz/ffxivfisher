/**
 * A container for various UI state.
 */

goog.provide('ff.fisher.ui.State');

goog.require('ff');
goog.require('ff.model.Area');
goog.require('ff.model.AreaEnum');
goog.require('ff.service.CookieService');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.json');
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

  /** @private {!ff.service.CookieService} */
  this.cookieService_ = ff.service.CookieService.getInstance();

  /**
   * Keeps track of an area's collapsed state.
   * @type {!Object.<string, boolean>}
   * @private
   */
  this.areaCollapseMap_ = {};

  this.initializeFromCookie_();
};
goog.inherits(ff.fisher.ui.State, goog.events.EventTarget);
goog.addSingletonGetter(ff.fisher.ui.State);


/**
 * The events dispatched from this object.
 * @enum {string}
 */
ff.fisher.ui.State.EventType = {
  COLLAPSE_CHANGED: ff.getUniqueId('collapse-changed')
};


/**
 * @const
 * @private
 * @type {string}
 */
ff.fisher.ui.State.COLLAPSE_STATE_ = 'ff_collapse_state';


/**
 * Checks if the given area is collapsed or not.
 * @param {!ff.model.Area} area
 * @return {boolean}
 */
ff.fisher.ui.State.prototype.isAreaCollapsed = function(area) {
  var key = ff.model.Area.getEnum(area);
  return this.isAreaCollapsed_(key);
};


/**
 * Collapses all of the areas.
 */
ff.fisher.ui.State.prototype.collapseAll = function() {
  this.setAll_(true);
};


/**
 * Expands all of the areas.
 */
ff.fisher.ui.State.prototype.expandAll = function() {
  this.setAll_(false);
};


/**
 * Checks to see if all areas are collapsed.
 * @return {boolean}
 */
ff.fisher.ui.State.prototype.isAllCollapsed = function() {
  var allCollapsed = true;
  goog.object.forEach(
      ff.model.AreaEnum,
      function(area, key, obj) {
        allCollapsed &= this.isAreaCollapsed_(key);
      },
      this);
  return allCollapsed;
};


/**
 * Collapses or expands the given area.
 * @param {!ff.model.Area} area
 */
ff.fisher.ui.State.prototype.toggleAreaCollapsed = function(area) {
  var key = ff.model.Area.getEnum(area);
  this.set_(area, !this.isAreaCollapsed_(key));
};


/**
 * Initializes the area collapse map from the cookie if there is one otherwise
 * sets up the default.
 * @private
 */
ff.fisher.ui.State.prototype.initializeFromCookie_ = function() {
  var cookieState = this.cookieService_.get(ff.fisher.ui.State.COLLAPSE_STATE_);
  var cookieMap = {};
  if (cookieState) {
    this.logger.info('Setting collapse state map from cookie.');
    try {
      cookieMap = JSON.parse(cookieState);
    } catch (e) {
      this.logger.severe('Failed to read collapse state from the cookie.');
    }
  }

  goog.object.forEach(
      ff.model.AreaEnum,
      function(area, key, obj) {
        var value = cookieMap[key] || false;
        this.areaCollapseMap_[key] = value;
      },
      this);
};


/**
 * Checks if the given area is collapsed or not.
 * @param {string} key
 * @return {boolean}
 * @private
 */
ff.fisher.ui.State.prototype.isAreaCollapsed_ = function(key) {
  return this.areaCollapseMap_[key] || false;
};


/**
 * Sets all areas to be either expanded or collapsed.
 * @param {boolean} collapsed
 * @private
 */
ff.fisher.ui.State.prototype.setAll_ = function(collapsed) {
  goog.object.forEach(
      ff.model.AreaEnum,
      function(area, key, obj) {
        this.set_(area, collapsed);
      },
      this);
};


/**
 * Sets the given area to have the given collapsed value.
 * An event is dispatched if the value changes.
 * @param {!ff.model.Area} area
 * @param {boolean} collapsed
 * @private
 */
ff.fisher.ui.State.prototype.set_ = function(area, collapsed) {
  var key = ff.model.Area.getEnum(area);
  var oldValue = this.isAreaCollapsed_(key);
  if (oldValue == collapsed) {
    return; // no change
  }

  // Set the new value.
  this.areaCollapseMap_[key] = collapsed;

  // Save state to a cookie so it's sticky for this user.
  var mapJson = goog.json.serialize(this.areaCollapseMap_);
  this.cookieService_.set(ff.fisher.ui.State.COLLAPSE_STATE_, mapJson);

  this.dispatchEvent(new ff.fisher.ui.State.CollapseChanged(area));
};



/**
 * The event that gets dispatched when an area's collapsed state changes.
 * @param {!ff.model.Area} area
 * @constructor
 * @extends {goog.events.Event}
 */
ff.fisher.ui.State.CollapseChanged = function(area) {
  goog.base(this, ff.fisher.ui.State.EventType.COLLAPSE_CHANGED);

  /** @type {!ff.model.Area} */
  this.area = area;
};
goog.inherits(ff.fisher.ui.State.CollapseChanged, goog.events.Event);
