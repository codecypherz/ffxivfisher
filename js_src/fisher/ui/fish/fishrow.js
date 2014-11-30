/**
 * Renders a single fish in a row format.
 */

goog.provide('ff.fisher.ui.fish.FishRow');

goog.require('ff');
goog.require('ff.fisher.ui.State');
goog.require('ff.fisher.ui.admin.AdminFishDialog');
goog.require('ff.fisher.ui.fish.CatchPath');
goog.require('ff.fisher.ui.fish.ColorChooser');
goog.require('ff.fisher.ui.fish.FishDetail');
goog.require('ff.fisher.ui.fish.FishTime');
goog.require('ff.fisher.ui.fish.soy');
goog.require('ff.model.Fish');
goog.require('ff.model.User');
goog.require('ff.ui');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @param {!ff.model.Fish} fish
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.fish.FishRow = function(fish) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.fish.FishRow');

  /** @private {!ff.model.Fish} */
  this.fish_ = fish;

  /** @private {!ff.model.User} */
  this.user_ = ff.model.User.getInstance();

  /** @private {!ff.fisher.ui.State} */
  this.uiState_ = ff.fisher.ui.State.getInstance();

  /** @private {!ff.fisher.ui.fish.ColorChooser} */
  this.colorChooser_ = new ff.fisher.ui.fish.ColorChooser(fish);
  this.addChild(this.colorChooser_);

  /** @private {!ff.fisher.ui.fish.FishTime} */
  this.time_ = new ff.fisher.ui.fish.FishTime(fish);
  this.addChild(this.time_);

  /** @private {!ff.fisher.ui.fish.CatchPath} */
  this.bestCatchPath_ = new ff.fisher.ui.fish.CatchPath(
      fish.getBestCatchPath());
  this.addChild(this.bestCatchPath_);

  /**
   * This is only constructed when showing detail and null when hidden.
   * @private {?ff.fisher.ui.fish.FishDetail}
   */
  this.fishDetail_ = null;
};
goog.inherits(ff.fisher.ui.fish.FishRow, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.fish.FishRow.Id_ = {
  BEST_CATCH_PATH: ff.getUniqueId('best-catch-path'),
  COLOR_CHOOSER: ff.getUniqueId('color-chooser'),
  DETAIL: ff.getUniqueId('detail'),
  NAME: ff.getUniqueId('name'),
  TIME: ff.getUniqueId('time')
};


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.fish.FishRow.Css_ = {
  CATCHABLE: goog.getCssName('ff-fish-catchable'),
  COLOR_ONE: goog.getCssName('ff-fish-row-color-one'),
  COLOR_TWO: goog.getCssName('ff-fish-row-color-two'),
  COLOR_THREE: goog.getCssName('ff-fish-row-color-three'),
  DETAIL_SHOWN: goog.getCssName('ff-fish-row-detail-shown')
};


/**
 * @type {!Array.<string>}
 * @const
 * @private
 */
ff.fisher.ui.fish.FishRow.ALL_COLOR_CLASSES_ = [
  ff.fisher.ui.fish.FishRow.Css_.COLOR_ONE,
  ff.fisher.ui.fish.FishRow.Css_.COLOR_TWO,
  ff.fisher.ui.fish.FishRow.Css_.COLOR_THREE
];


/** @override */
ff.fisher.ui.fish.FishRow.prototype.createDom = function() {
  // Render soy template.
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.fish.soy.FISH_ROW, {
        ids: this.makeIds(ff.fisher.ui.fish.FishRow.Id_),
        name: this.fish_.getName(),
        location: this.fish_.getLocation().getName(),
        imageSrc: this.fish_.getImageUrl()
      }));

  // Render color chooser.
  this.colorChooser_.render(ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishRow.Id_.COLOR_CHOOSER));

  // Render time.
  this.time_.render(ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishRow.Id_.TIME));

  // Render best catch path.
  this.bestCatchPath_.render(ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishRow.Id_.BEST_CATCH_PATH));

  // Fish detail rendered on demand.
};


/** @override */
ff.fisher.ui.fish.FishRow.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');


  this.getHandler().listen(
      this.getElement(),
      goog.events.EventType.CLICK,
      function(e) {
        if (e.altKey && this.user_.isAdmin()) {
          new ff.fisher.ui.admin.AdminFishDialog(this.fish_).show();
        } else {
          this.toggleDetail_();
        }
      });

  // TODO Update catchable on the hour.
  this.getHandler().listen(
      this.fish_,
      ff.model.Fish.EventType.CATCHABLE_CHANGED,
      this.updateCatchable_);

  this.getHandler().listen(
      this.fish_,
      ff.model.Fish.EventType.COLOR_CHANGED,
      this.updateColor_);

  this.updateCatchable_();
  this.updateColor_();
  this.updateDetail_();
};


/**
 * Updates the row to reflect if the fish is catchable.
 * @private
 */
ff.fisher.ui.fish.FishRow.prototype.updateCatchable_ = function() {
  if (!this.isInDocument()) {
    return;
  }

  goog.dom.classlist.enable(
      this.getElement(),
      ff.fisher.ui.fish.FishRow.Css_.CATCHABLE,
      this.fish_.isCatchable());
};


/**
 * Updates the color of the fish based on the color chosen by the user.
 * @private
 */
ff.fisher.ui.fish.FishRow.prototype.updateColor_ = function() {
  if (!this.isInDocument()) {
    return;
  }

  var colorClass = null;
  var color = this.fish_.getUserColor();
  if (color == ff.model.Fish.Color.ONE) {
    colorClass = ff.fisher.ui.fish.FishRow.Css_.COLOR_ONE;
  } else if (color == ff.model.Fish.Color.TWO) {
    colorClass = ff.fisher.ui.fish.FishRow.Css_.COLOR_TWO;
  } else if (color == ff.model.Fish.Color.THREE) {
    colorClass = ff.fisher.ui.fish.FishRow.Css_.COLOR_THREE;
  }

  goog.dom.classlist.removeAll(
      this.getElement(),
      ff.fisher.ui.fish.FishRow.ALL_COLOR_CLASSES_);

  if (goog.isDefAndNotNull(colorClass)) {
    goog.dom.classlist.add(
        this.getElement(),
        colorClass);
  }
};


/**
 * Toggles the showing/hiding of fish detail.
 * @private
 */
ff.fisher.ui.fish.FishRow.prototype.toggleDetail_ = function() {
  if (!this.isInDocument()) {
    return;
  }
  this.uiState_.toggleFishCollapsed(this.fish_);
  this.updateDetail_();
};


/**
 * Updates the render state of the fish detail.
 * @private
 */
ff.fisher.ui.fish.FishRow.prototype.updateDetail_ = function() {

  var shownClass = ff.fisher.ui.fish.FishRow.Css_.DETAIL_SHOWN;

  if (this.uiState_.isFishCollapsed(this.fish_)) {
    // We are collapsed, so see if fish detail is showing.
    if (goog.isDefAndNotNull(this.fishDetail_)) {
      // Destroy fish detail.
      this.removeChild(this.fishDetail_);
      this.fishDetail_.dispose();
      this.fishDetail_ = null;
      goog.dom.classlist.enable(this.getElement(), shownClass, false);
    }
  } else {
    // We are showing, so make sure the detail is rendered.
    if (!goog.isDefAndNotNull(this.fishDetail_)) {
      // Create fish detail.
      this.fishDetail_ = new ff.fisher.ui.fish.FishDetail(this.fish_);
      this.addChild(this.fishDetail_);
      this.fishDetail_.render(ff.ui.getElementByFragment(
          this, ff.fisher.ui.fish.FishRow.Id_.DETAIL));
      goog.dom.classlist.enable(this.getElement(), shownClass, true);
    }
  }
};
