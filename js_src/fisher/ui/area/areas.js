/**
 * Renders fish for a single area.
 */

goog.provide('ff.fisher.ui.area.Areas');

goog.require('ff');
goog.require('ff.fisher.ui.State');
goog.require('ff.fisher.ui.area.Area');
goog.require('ff.fisher.ui.area.soy');
goog.require('ff.model.AreaEnum');
goog.require('ff.ui');
goog.require('ff.ui.Css');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
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

  /** @private {!ff.fisher.ui.State} */
  this.uiState_ = ff.fisher.ui.State.getInstance();
};
goog.inherits(ff.fisher.ui.area.Areas, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.area.Areas.Id_ = {
  AREAS: ff.getUniqueId('areas'),
  TOGGLE: ff.getUniqueId('toggle'),
  TOGGLE_TEXT: ff.getUniqueId('toggle-text')
};


/** @override */
ff.fisher.ui.area.Areas.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.area.soy.AREAS, {
        ids: this.makeIds(ff.fisher.ui.area.Areas.Id_)
      }));

  goog.array.forEach(this.areas_, function(area) {
    area.render(ff.ui.getElementByFragment(
        this, ff.fisher.ui.area.Areas.Id_.AREAS));
  }, this);
};


/** @override */
ff.fisher.ui.area.Areas.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(
      ff.ui.getElementByFragment(this, ff.fisher.ui.area.Areas.Id_.TOGGLE),
      goog.events.EventType.CLICK,
      this.toggleAll_);

  this.update_();
};


/**
 * Toggles all areas to be either expanded or collapsed.
 * @private
 */
ff.fisher.ui.area.Areas.prototype.toggleAll_ = function() {
  if (this.uiState_.isAllCollapsed()) {
    this.uiState_.expandAll();
  } else {
    this.uiState_.collapseAll();
  }
  this.update_();
};


/**
 * Updates the collapse/expand piece to reflect current state.
 * @private
 */
ff.fisher.ui.area.Areas.prototype.update_ = function() {
  // Update the text.
  var text = this.uiState_.isAllCollapsed() ? 'Expand All' : 'Collapse All';
  goog.dom.setTextContent(
      ff.ui.getElementByFragment(
          this, ff.fisher.ui.area.Areas.Id_.TOGGLE_TEXT),
      text);

  // Update the class to flip the chevron - see the CSS selector.
  goog.dom.classlist.enable(
      ff.ui.getElementByFragment(this, ff.fisher.ui.area.Areas.Id_.TOGGLE),
      ff.ui.Css.COLLAPSED,
      this.uiState_.isAllCollapsed());
};
