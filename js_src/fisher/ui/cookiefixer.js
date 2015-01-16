/**
 * Service for converting legacy session cookies into persistent cookies.
 */

goog.provide('ff.fisher.ui.CookieFixer');

goog.require('ff.service.FishService');
goog.require('goog.Disposable');
goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.log');



/**
 * @constructor
 * @extends {goog.Disposable}
 */
ff.fisher.ui.CookieFixer = function() {

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.CookieFixer');

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();

  this.handler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.handler_);

  this.handler_.listen(
      this.fishService_,
      ff.service.FishService.EventType.FISH_CHANGED,
      this.updateFishCookies_);
};
goog.inherits(ff.fisher.ui.CookieFixer, goog.Disposable);
goog.addSingletonGetter(ff.fisher.ui.CookieFixer);


/**
 * Mostly a no-op but prevents auto optimizations that might remove this class.
 */
ff.fisher.ui.CookieFixer.prototype.initialize = function() {
  goog.log.info(this.logger, 'Initialized.');
};


/**
 * Updates fish cookies by forcing a re-save on each fish.
 * @private
 */
ff.fisher.ui.CookieFixer.prototype.updateFishCookies_ = function() {
  goog.array.forEach(this.fishService_.getAll(), function(fish) {
    var legacyColor = fish.getLegacyUserColor();
    if (goog.isDefAndNotNull(legacyColor)) {
      fish.setUserColor(legacyColor);
      fish.removeLegacyUserColorCookie();
    }
  }, this);
  goog.log.info(this.logger, 'Updated all fish cookies.');
};
