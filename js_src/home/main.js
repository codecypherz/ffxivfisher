/**
 * Main bootstrapping file which gets the entire application going.
 */

goog.provide('ff.home.Main');

goog.require('ff.home.ui.Root');
goog.require('goog.Disposable');
goog.require('goog.debug.Console');
/** @suppress {extraRequire} Needed for compilation warnings within closure. */
goog.require('goog.debug.ErrorHandler');
/** @suppress {extraRequire} Needed for compilation warnings within closure. */
goog.require('goog.events.EventWrapper');
goog.require('goog.log');



/**
 * The container for all the main components of the application.
 * @constructor
 * @extends {goog.Disposable}
 */
ff.home.Main = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.home.Main');

  // Set up logging for the entire application.
  if (!goog.debug.Console.instance) {
    goog.debug.Console.instance = new goog.debug.Console();
  }
  var console = goog.debug.Console.instance;
  console.setCapturing(true);
  goog.log.info(this.logger, 'Finished setting up logging');

  // Register an unload event to properly clean up resources.
  window.onbeforeunload = goog.bind(this.onUnload_, this);

  // Create and render the UI.
  var root = new ff.home.ui.Root();
  this.registerDisposable(root);
  root.render();
};
goog.inherits(ff.home.Main, goog.Disposable);


/**
 * Called when the application unloads.
 * @private
 */
ff.home.Main.prototype.onUnload_ = function() {
  this.disposeInternal();
};


/**
 * Main entry point to the program.  All bootstrapping happens here.
 */
ff.home.Main.bootstrap = function() {
  new ff.home.Main();
};


// Ensures the symbol will be visible after compiler renaming.
goog.exportSymbol('ff.home.Main.bootstrap', ff.home.Main.bootstrap);
