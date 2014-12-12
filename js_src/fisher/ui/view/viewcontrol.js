/**
 * Allows the user to control the view over the fish.
 */

goog.provide('ff.fisher.ui.view.ViewControl');

goog.require('ff');
goog.require('ff.fisher.ui.State');
goog.require('ff.fisher.ui.view.soy');
goog.require('ff.ui');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.view.ViewControl = function() {
  goog.base(this);

  /** @private {!ff.fisher.ui.State} */
  this.uiState_ = ff.fisher.ui.State.getInstance();

  /** @private {Element} */
  this.allRadioButton_ = null;

  /** @private {Element} */
  this.byAreaRadioButton_ = null;

  /** @private {Element} */
  this.colorOne_ = null;

  /** @private {Element} */
  this.colorTwo_ = null;

  /** @private {Element} */
  this.colorThree_ = null;

  /** @private {Element} */
  this.noColor_ = null;
};
goog.inherits(ff.fisher.ui.view.ViewControl, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.view.ViewControl.Id_ = {
  ALL_RADIO_BUTTON: ff.getUniqueId('all'),
  BY_AREA_RADIO_BUTTON: ff.getUniqueId('by-area'),
  COLOR_ONE: ff.getUniqueId('color-one'),
  COLOR_TWO: ff.getUniqueId('color-two'),
  COLOR_THREE: ff.getUniqueId('color-three'),
  NO_COLOR: ff.getUniqueId('no-color')
};


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.view.ViewControl.Css_ = {
  FILTER_ENABLED: goog.getCssName('ff-fish-view-filter-enabled')
};


/** @override */
ff.fisher.ui.view.ViewControl.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.view.soy.VIEW_CONTROL, {
        ids: this.makeIds(ff.fisher.ui.view.ViewControl.Id_),
        views: ff.fisher.ui.State.View
      }));

  this.allRadioButton_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.view.ViewControl.Id_.ALL_RADIO_BUTTON);
  this.byAreaRadioButton_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.view.ViewControl.Id_.BY_AREA_RADIO_BUTTON);

  this.colorOne_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.view.ViewControl.Id_.COLOR_ONE);
  this.colorTwo_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.view.ViewControl.Id_.COLOR_TWO);
  this.colorThree_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.view.ViewControl.Id_.COLOR_THREE);
  this.noColor_ = ff.ui.getElementByFragment(
      this, ff.fisher.ui.view.ViewControl.Id_.NO_COLOR);

  this.updateViewState_();
  this.updateFilterState_();
};


/** @override */
ff.fisher.ui.view.ViewControl.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  // View state.
  this.getHandler().listen(
      this.uiState_,
      ff.fisher.ui.State.EventType.VIEW_CHANGED,
      this.updateViewState_);

  this.getHandler().listen(
      this.allRadioButton_,
      goog.events.EventType.CHANGE,
      function(e) {
        this.uiState_.setView(ff.fisher.ui.State.View.ALL);
      });
  this.getHandler().listen(
      this.byAreaRadioButton_,
      goog.events.EventType.CHANGE,
      function(e) {
        this.uiState_.setView(ff.fisher.ui.State.View.BY_AREA);
      });

  // Filter state.
  this.getHandler().listen(
      this.uiState_,
      ff.fisher.ui.State.EventType.FILTER_CHANGED,
      this.updateFilterState_);

  // TODO: Create a filter component.
  this.getHandler().listen(
      this.colorOne_,
      goog.events.EventType.CLICK,
      function(e) {
        this.uiState_.toggleFilter(ff.fisher.ui.State.Filter.COLOR_ONE);
      });
  this.getHandler().listen(
      this.colorTwo_,
      goog.events.EventType.CLICK,
      function(e) {
        this.uiState_.toggleFilter(ff.fisher.ui.State.Filter.COLOR_TWO);
      });
  this.getHandler().listen(
      this.colorThree_,
      goog.events.EventType.CLICK,
      function(e) {
        this.uiState_.toggleFilter(ff.fisher.ui.State.Filter.COLOR_THREE);
      });
  this.getHandler().listen(
      this.noColor_,
      goog.events.EventType.CLICK,
      function(e) {
        this.uiState_.toggleFilter(ff.fisher.ui.State.Filter.NO_COLOR);
      });
};


/**
 * Updates the controls based on the currently selected view.
 * @private
 */
ff.fisher.ui.view.ViewControl.prototype.updateViewState_ = function() {
  var view = this.uiState_.getView();
  if (view == ff.fisher.ui.State.View.ALL) {
    this.allRadioButton_.checked = true;
  } else if (view == ff.fisher.ui.State.View.BY_AREA) {
    this.byAreaRadioButton_.checked = true;
  }
};


/**
 * Updates the state of the filter control buttons based on existing filters.
 * @private
 */
ff.fisher.ui.view.ViewControl.prototype.updateFilterState_ = function() {
  goog.dom.classlist.enable(
      this.colorOne_,
      ff.fisher.ui.view.ViewControl.Css_.FILTER_ENABLED,
      this.uiState_.isFilterEnabled(ff.fisher.ui.State.Filter.COLOR_ONE));
  goog.dom.classlist.enable(
      this.colorTwo_,
      ff.fisher.ui.view.ViewControl.Css_.FILTER_ENABLED,
      this.uiState_.isFilterEnabled(ff.fisher.ui.State.Filter.COLOR_TWO));
  goog.dom.classlist.enable(
      this.colorThree_,
      ff.fisher.ui.view.ViewControl.Css_.FILTER_ENABLED,
      this.uiState_.isFilterEnabled(ff.fisher.ui.State.Filter.COLOR_THREE));
  goog.dom.classlist.enable(
      this.noColor_,
      ff.fisher.ui.view.ViewControl.Css_.FILTER_ENABLED,
      this.uiState_.isFilterEnabled(ff.fisher.ui.State.Filter.NO_COLOR));
};
