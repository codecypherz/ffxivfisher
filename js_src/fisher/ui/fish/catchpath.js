/**
 * Renders a catch path.
 */

goog.provide('ff.fisher.ui.fish.CatchPath');

goog.require('ff.fisher.ui.fish.soy');
goog.require('goog.array');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');



/**
 * @param {!ff.model.CatchPath} catchPath
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.fish.CatchPath = function(catchPath) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.fish.CatchPath');

  /** @private {!ff.model.CatchPath} */
  this.catchPath_ = catchPath;
};
goog.inherits(ff.fisher.ui.fish.CatchPath, goog.ui.Component);


/** @override */
ff.fisher.ui.fish.CatchPath.prototype.createDom = function() {
  var catchPathParts = [];
  goog.array.forEach(this.catchPath_.getCatchPathParts(), function(part) {
    catchPathParts.push({
      imageUrl: part.getImageUrl(),
      name: part.getName()
    });
  });
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.fish.soy.CATCH_PATH, {
        catchPathParts: catchPathParts
      }));
};
