/**
 * The top level component for the home page.
 */

goog.provide('ff.fisher.ui.Root');

goog.require('ff');
goog.require('ff.fisher.ui.Areas');
goog.require('ff.fisher.ui.Header');
goog.require('ff.fisher.ui.soy');
goog.require('ff.ui');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.Root = function() {
  goog.base(this);

  /** @private {!ff.fisher.ui.Header} */
  this.header_ = new ff.fisher.ui.Header();
  this.addChild(this.header_);

  /** @private {!ff.fisher.ui.Areas} */
  this.areas_ = new ff.fisher.ui.Areas();
  this.addChild(this.areas_);
};
goog.inherits(ff.fisher.ui.Root, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.Root.Id_ = {
  CENTERED_CONTENT: ff.getUniqueId('centered-content')
};


/** @override */
ff.fisher.ui.Root.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.soy.ROOT, {
        ids: this.makeIds(ff.fisher.ui.Root.Id_)
      }));

  var centered = ff.ui.getElementByFragment(
      this, ff.fisher.ui.Root.Id_.CENTERED_CONTENT);
  this.header_.render(centered);
  this.areas_.render(centered);
};
