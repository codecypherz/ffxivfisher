/**
 * The top level component for the home page.
 */

goog.provide('ff.fisher.ui.Root');

goog.require('ff.fisher.ui.Areas');
goog.require('ff.fisher.ui.Header');
goog.require('goog.dom.classlist');
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
 * CSS for this component.
 * @enum {string}
 * @private
 */
ff.fisher.ui.Root.Css_ = {
  ROOT: goog.getCssName('ff-fisher-root')
};


/** @override */
ff.fisher.ui.Root.prototype.createDom = function() {
  goog.base(this, 'createDom');

  goog.dom.classlist.add(this.getElement(), ff.fisher.ui.Root.Css_.ROOT);

  this.header_.render(this.getElement());
  this.areas_.render(this.getElement());
};
