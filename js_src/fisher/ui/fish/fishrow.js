/**
 * Renders a single fish in a row format.
 */

goog.provide('ff.fisher.ui.fish.FishRow');

goog.require('ff');
goog.require('ff.fisher.ui.admin.AdminFishDialog');
goog.require('ff.fisher.ui.fish.CatchPath');
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

  /** @private {!ff.fisher.ui.fish.FishTime} */
  this.time_ = new ff.fisher.ui.fish.FishTime(fish);
  this.addChild(this.time_);

  /** @private {!ff.fisher.ui.fish.CatchPath} */
  this.bestCatchPath_ = new ff.fisher.ui.fish.CatchPath(
      fish.getBestCatchPath());
  this.addChild(this.bestCatchPath_);
};
goog.inherits(ff.fisher.ui.fish.FishRow, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.fish.FishRow.Id_ = {
  BEST_CATCH_PATH: ff.getUniqueId('best-catch-path'),
  NAME: ff.getUniqueId('name'),
  TIME: ff.getUniqueId('time')
};


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.fish.FishRow.Css_ = {
  CATCHABLE: goog.getCssName('ff-fish-catchable')
};


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

  // Render time.
  this.time_.render(ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishRow.Id_.TIME));

  // Render best catch path.
  this.bestCatchPath_.render(ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishRow.Id_.BEST_CATCH_PATH));
};


/** @override */
ff.fisher.ui.fish.FishRow.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  if (this.user_.isAdmin()) {
    this.getHandler().listen(
        this.getElement(),
        goog.events.EventType.CLICK,
        function(e) {
          if (e.altKey) {
            new ff.fisher.ui.admin.AdminFishDialog(this.fish_).show();
          }
        });
  }

  this.getHandler().listen(
      this.fish_,
      ff.model.Fish.EventType.CATCHABLE_CHANGED,
      this.updateCatchable_);

  this.updateCatchable_();
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
