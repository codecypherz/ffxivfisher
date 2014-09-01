/**
 * The component that contains fish rows.
 */

goog.provide('ff.fisher.ui.FishTable');

goog.require('ff.fisher.ui.FishRow');
goog.require('ff.service.FishService');
goog.require('ff.service.FishWatcher');
goog.require('ff.ui.Css');
goog.require('goog.array');
goog.require('goog.dom.classlist');
goog.require('goog.log');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.FishTable = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.FishTable');

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();

  /** @private {!ff.service.FishWatcher} */
  this.fishWatcher_ = ff.service.FishWatcher.getInstance();
};
goog.inherits(ff.fisher.ui.FishTable, goog.ui.Component);


/**
 * CSS for this component.
 * @enum {string}
 * @private
 */
ff.fisher.ui.FishTable.Css_ = {
  ROOT: goog.getCssName('ff-fish-table')
};


/** @override */
ff.fisher.ui.FishTable.prototype.createDom = function() {
  goog.base(this, 'createDom');

  goog.dom.classlist.addAll(this.getElement(),
      [ff.ui.Css.TABLE, ff.fisher.ui.FishTable.Css_.ROOT]);

  this.renderFish_();
};


/** @override */
ff.fisher.ui.FishTable.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(
      this.fishService_,
      ff.service.FishService.EventType.FISH_CHANGED,
      this.renderFish_);

  this.getHandler().listen(
      this.fishWatcher_,
      ff.service.FishWatcher.EventType.CATCHABLE_SET_CHANGED,
      this.renderFish_);
};


/**
 * @private
 */
ff.fisher.ui.FishTable.prototype.renderFish_ = function() {
  this.logger.info('Rendering fish.');
  var fishes = this.fishService_.getAll();

  // Clear existing fish.
  goog.disposeAll(this.removeChildren(true));

  // Render the fish.
  goog.array.forEach(fishes, function(fish) {
    var fishRow = new ff.fisher.ui.FishRow(fish);
    this.addChild(fishRow);
    fishRow.render(this.getElement());
  }, this);
};
