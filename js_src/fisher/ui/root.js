/**
 * The top level component for the home page.
 */

goog.provide('ff.fisher.ui.Root');

goog.require('ff.fisher.ui.AdminFishDialog');
goog.require('ff.fisher.ui.EorzeaClock');
goog.require('ff.fisher.ui.FishTable');
goog.require('ff.model.User');
goog.require('ff.ui.Css');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.Root = function() {
  goog.base(this);

  /** @private {!ff.model.User} */
  this.user_ = ff.model.User.getInstance();

  /** @private {!ff.fisher.ui.EorzeaClock} */
  this.eorzeaClock_ = new ff.fisher.ui.EorzeaClock();
  this.addChild(this.eorzeaClock_);

  /** @private {!ff.fisher.ui.FishTable} */
  this.fishTable_ = new ff.fisher.ui.FishTable();
  this.addChild(this.fishTable_);

  /** @private {goog.ui.Button} */
  this.newFishButton_ = null;
  if (this.user_.isAdmin()) {
    this.newFishButton_ = new goog.ui.Button('New Fish');
    this.addChild(this.newFishButton_);
  }
};
goog.inherits(ff.fisher.ui.Root, goog.ui.Component);


/**
 * CSS for this component.
 * @enum {string}
 * @private
 */
ff.fisher.ui.Root.Css_ = {
  NEW_FISH_BUTTON: goog.getCssName('ff-fisher-new-fish-button'),
  ROOT: goog.getCssName('ff-fisher-root')
};


/** @override */
ff.fisher.ui.Root.prototype.createDom = function() {
  goog.base(this, 'createDom');

  goog.dom.classlist.addAll(this.getElement(),
      [ff.ui.Css.CARD, ff.fisher.ui.Root.Css_.ROOT]);

  this.eorzeaClock_.render(this.getElement());

  this.fishTable_.render(this.getElement());

  if (goog.isDefAndNotNull(this.newFishButton_)) {
    this.newFishButton_.render(this.getElement());
    goog.dom.classlist.add(this.newFishButton_.getElement(),
        ff.fisher.ui.Root.Css_.NEW_FISH_BUTTON);
  }
};


/** @override */
ff.fisher.ui.Root.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  if (goog.isDefAndNotNull(this.newFishButton_)) {
    this.getHandler().listen(this.newFishButton_,
        goog.ui.Component.EventType.ACTION,
        function() {
          new ff.fisher.ui.AdminFishDialog().show();
        });
  }
};
