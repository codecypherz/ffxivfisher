/**
 * The header for the page.
 */

goog.provide('ff.fisher.ui.Header');

goog.require('ff');
goog.require('ff.fisher.ui.AdminFishDialog');
goog.require('ff.fisher.ui.EorzeaClock');
goog.require('ff.fisher.ui.soy');
goog.require('ff.model.User');
goog.require('ff.ui');
goog.require('goog.dom.classlist');
goog.require('goog.soy');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.Header = function() {
  goog.base(this);

  /** @private {!ff.model.User} */
  this.user_ = ff.model.User.getInstance();

  /** @private {!ff.fisher.ui.EorzeaClock} */
  this.eorzeaClock_ = new ff.fisher.ui.EorzeaClock();
  this.addChild(this.eorzeaClock_);

  /** @private {goog.ui.Button} */
  this.newFishButton_ = null;
  if (this.user_.isAdmin()) {
    this.newFishButton_ = new goog.ui.Button('New Fish');
    this.addChild(this.newFishButton_);
  }
};
goog.inherits(ff.fisher.ui.Header, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.Header.Css_ = {
  NEW_FISH_BUTTON: goog.getCssName('ff-fisher-new-fish-button')
};


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.Header.Id_ = {
  CLOCK_CONTAINER: ff.getUniqueId('clock-container'),
  NEW_FISH_BUTTON_CONTAINER: ff.getUniqueId('new-fish-button-container')
};


/** @override */
ff.fisher.ui.Header.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.soy.HEADER, {
        ids: this.makeIds(ff.fisher.ui.Header.Id_)
      }));

  this.eorzeaClock_.render(ff.ui.getElementByFragment(
      this, ff.fisher.ui.Header.Id_.CLOCK_CONTAINER));

  if (goog.isDefAndNotNull(this.newFishButton_)) {
    this.newFishButton_.render(ff.ui.getElementByFragment(
        this, ff.fisher.ui.Header.Id_.NEW_FISH_BUTTON_CONTAINER));
    goog.dom.classlist.add(
        this.newFishButton_.getElement(),
        ff.fisher.ui.Header.Css_.NEW_FISH_BUTTON);
  }
};


/** @override */
ff.fisher.ui.Header.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  if (goog.isDefAndNotNull(this.newFishButton_)) {
    this.getHandler().listen(this.newFishButton_,
        goog.ui.Component.EventType.ACTION,
        function() {
          new ff.fisher.ui.AdminFishDialog().show();
        });
  }
};
