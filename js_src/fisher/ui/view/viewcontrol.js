/**
 * Allows the user to control the view over the fish.
 */

goog.provide('ff.fisher.ui.view.ViewControl');

goog.require('ff');
goog.require('ff.fisher.ui.State');
goog.require('ff.fisher.ui.view.soy');
goog.require('ff.ui');
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
};
goog.inherits(ff.fisher.ui.view.ViewControl, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.view.ViewControl.Id_ = {
  ALL_RADIO_BUTTON: ff.getUniqueId('all'),
  BY_AREA_RADIO_BUTTON: ff.getUniqueId('by-area')
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

  this.updateViewState_();
};


/** @override */
ff.fisher.ui.view.ViewControl.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

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
