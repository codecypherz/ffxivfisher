/**
 * The top level component for the home page.
 */

goog.provide('ff.fisher.ui.Root');

goog.require('ff.fisher.ui.FishTable');
goog.require('ff.fisher.ui.NewFishDialog');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.Root = function() {
  goog.base(this);

  /** @private {!ff.fisher.ui.FishTable} */
  this.fishTable_ = new ff.fisher.ui.FishTable();
  this.addChild(this.fishTable_);

  /** @private {!goog.ui.Button} */
  this.newFishButton_ = new goog.ui.Button('New Fish');
  this.addChild(this.newFishButton_);
};
goog.inherits(ff.fisher.ui.Root, goog.ui.Component);


/** @override */
ff.fisher.ui.Root.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.fishTable_.render(this.getElement());
  this.newFishButton_.render(this.getElement());
};


/** @override */
ff.fisher.ui.Root.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.newFishButton_,
      goog.ui.Component.EventType.ACTION,
      function() {
        new ff.fisher.ui.NewFishDialog().show();
      });
};
