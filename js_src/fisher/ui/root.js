/**
 * The top level component for the home page.
 */

goog.provide('ff.fisher.ui.Root');

goog.require('ff');
goog.require('ff.fisher.ui.Header');
goog.require('ff.fisher.ui.State');
goog.require('ff.fisher.ui.all.AllFish');
goog.require('ff.fisher.ui.area.Areas');
goog.require('ff.fisher.ui.soy');
goog.require('ff.fisher.ui.view.ViewControl');
goog.require('ff.ui');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.Root = function() {
  goog.base(this);

  /** @private {!ff.fisher.ui.State} */
  this.uiState_ = ff.fisher.ui.State.getInstance();

  /** @private {!ff.fisher.ui.Header} */
  this.header_ = new ff.fisher.ui.Header();
  this.addChild(this.header_);

  /** @private {!ff.fisher.ui.view.ViewControl} */
  this.viewControl_ = new ff.fisher.ui.view.ViewControl();
  this.addChild(this.viewControl_);

  /** @private {?goog.ui.Component} */
  this.currentView_ = null;
};
goog.inherits(ff.fisher.ui.Root, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.Root.Id_ = {
  HEADER: ff.getUniqueId('header'),
  VIEW_CONTROL: ff.getUniqueId('view-control'),
  VIEW_CONTAINER: ff.getUniqueId('view-container')
};


/** @override */
ff.fisher.ui.Root.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.soy.ROOT, {
        ids: this.makeIds(ff.fisher.ui.Root.Id_)
      }));

  this.header_.render(ff.ui.getElementByFragment(
      this, ff.fisher.ui.Root.Id_.HEADER));
  this.viewControl_.render(ff.ui.getElementByFragment(
      this, ff.fisher.ui.Root.Id_.VIEW_CONTROL));

  this.renderCurrentView_();
};


/** @override */
ff.fisher.ui.Root.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(
      this.uiState_,
      ff.fisher.ui.State.EventType.VIEW_CHANGED,
      this.renderCurrentView_);
};


/**
 * Renders the current view.
 * @private
 */
ff.fisher.ui.Root.prototype.renderCurrentView_ = function() {
  // Clean up the old view if it was already rendered.
  if (this.currentView_) {
    this.removeChild(this.currentView_, true);
    goog.dispose(this.currentView_);
  }

  // Render the new view.
  this.currentView_ = this.getViewComponent_(this.uiState_.getView());
  this.addChild(this.currentView_);
  this.currentView_.render(ff.ui.getElementByFragment(
      this, ff.fisher.ui.Root.Id_.VIEW_CONTAINER));
};


/**
 * Figures out which UI component belongs to the view identifier.
 * @param {!ff.fisher.ui.State.View} view
 * @return {!goog.ui.Component}
 * @private
 */
ff.fisher.ui.Root.prototype.getViewComponent_ = function(view) {
  if (view == ff.fisher.ui.State.View.ALL) {
    return new ff.fisher.ui.all.AllFish();
  } else if (view == ff.fisher.ui.State.View.BY_AREA) {
    return new ff.fisher.ui.area.Areas();
  }
  throw new Error('Failed to create a view component for ' + view);
};
