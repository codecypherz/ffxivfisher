/**
 * Service for interacting with fish data.
 */

goog.provide('ff.service.Fish');

goog.require('ff.model.Fish');
goog.require('ff.service.Xhr');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.events.EventTarget');
goog.require('goog.log');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ff.service.Fish = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.service.Fish');

  /** @private {!ff.service.Xhr} */
  this.xhrService_ = ff.service.Xhr.getInstance();
};
goog.inherits(ff.service.Fish, goog.events.EventTarget);
goog.addSingletonGetter(ff.service.Fish);


/**
 * Loads the fish from the server.
 * @return {!goog.async.Deferred}
 */
ff.service.Fish.prototype.getAll = function() {
  // TODO Prevent multiple calls from issuing duplicate requests.
  goog.log.info(this.logger, 'Loading all ff.');

  // Create the request URL.
  var uri = new goog.Uri();
  uri.setPath('/fishes');

  // Send the request.
  var deferred = this.xhrService_.get(uri, true);

  // Handle the response.
  deferred.addCallback(this.onFishLoaded_, this);

  return deferred;
};


/**
 * Called when the request for all fish completes successfully.
 * @param {Object} fishesJson The JSON response.
 * @return {!Array.<!ff.model.Fish>} The parsed fish objects from the
 *     response.
 * @private
 */
ff.service.Fish.prototype.onFishLoaded_ = function(fishesJson) {
  goog.log.info(this.logger, 'All fish received.');

  if (!goog.isArray(fishesJson)) {
    var errorMsg = 'JSON was not in array format.';
    goog.log.error(this.logger, errorMsg);
    throw Error(errorMsg);
  }

  // Convert all the JSON into model objects.
  this.fish_ = [];
  goog.array.forEach(fishesJson, function(fishJson) {
    try {
      this.fish_.push(ff.model.Fish.fromJson(fishJson));
    } catch (e) {
      // Catch the error so other fish still make it through.
      goog.log.error(
          this.logger, 'Failed to build fish from this JSON: ' + fishJson);
    }
  }, this);

  // This is what is now passed in the deferred chain.
  return this.fish_;
};
