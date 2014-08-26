/**
 * The prompt to create a new game.
 */

goog.provide('ff.fisher.ui.NewFishDialog');

goog.require('ff');
goog.require('ff.fisher.ui.soy');
goog.require('ff.model.Fish');
goog.require('ff.model.Weather');
goog.require('ff.service.FishService');
goog.require('goog.dom');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.string');
goog.require('goog.structs.Set');
goog.require('goog.ui.Dialog');



/**
 * @constructor
 * @extends {goog.ui.Dialog}
 */
ff.fisher.ui.NewFishDialog = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.NewFishDialog');

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();

  this.setTitle('Create a new fish');
  this.setDisposeOnHide(true);

  var buttonSet = new goog.ui.Dialog.ButtonSet()
      .addButton({
        key: ff.fisher.ui.NewFishDialog.Id_.CONFIRM_BUTTON,
        caption: 'Create'
      }, true)
      .addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, false, true);
  this.setButtonSet(buttonSet);
};
goog.inherits(ff.fisher.ui.NewFishDialog, goog.ui.Dialog);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.NewFishDialog.Id_ = {
  CONFIRM_BUTTON: ff.getUniqueId('confirm-button'),
  NAME_INPUT: ff.getUniqueId('name-input')
};


/**
 * Shows the dialog.
 */
ff.fisher.ui.NewFishDialog.prototype.show = function() {
  this.setVisible(true);
};


/** @override */
ff.fisher.ui.NewFishDialog.prototype.createDom = function() {
  goog.base(this, 'createDom');

  // Don't use setContent because that requires a string.  It doesn't make sense
  // to render the template as a string just to accommodate a limitation in the
  // dialog class.
  this.getContentElement().appendChild(goog.soy.renderAsElement(
      ff.fisher.ui.soy.NEW_FISH_DIALOG, {
        ids: this.makeIds(ff.fisher.ui.NewFishDialog.Id_)
      }));

  var confirmButton = this.getButtonSet().getButton(
      ff.fisher.ui.NewFishDialog.Id_.CONFIRM_BUTTON);

  goog.dom.setTextContent(this.getTitleCloseElement(), 'X');
};


/** @override */
ff.fisher.ui.NewFishDialog.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this,
      goog.ui.Dialog.EventType.SELECT,
      this.onSelect_);
};


/** @override */
ff.fisher.ui.NewFishDialog.prototype.focus = function() {
  goog.base(this, 'focus');
  this.getElementByFragment(
      ff.fisher.ui.NewFishDialog.Id_.NAME_INPUT).focus();
};


/**
 * @param {!goog.ui.Dialog.Event} e
 * @private
 */
ff.fisher.ui.NewFishDialog.prototype.onSelect_ = function(e) {
  if (ff.fisher.ui.NewFishDialog.Id_.CONFIRM_BUTTON == e.key) {

    // Validate the name.
    var nameInput = this.getElementByFragment(
        ff.fisher.ui.NewFishDialog.Id_.NAME_INPUT);
    var name = nameInput.value;
    if (goog.string.isEmptySafe(name)) {
      nameInput.select();
      e.preventDefault();
      return;
    }

    // TODO Create input for this.
    var weatherSet = new goog.structs.Set();
    weatherSet.add(ff.model.Weather.GLOOM);

    // Create the fish and store it.
    this.fishService_.storeNewFish(new ff.model.Fish(
        '', name, weatherSet, 0, 5));
  }
  this.setVisible(false);
};
