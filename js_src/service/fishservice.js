/**
 * Service for interacting with fish data.
 */

goog.provide('ff.service.FishService');

goog.require('ff');
goog.require('ff.model.Fish');
goog.require('ff.service.XhrService');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.events.EventTarget');
goog.require('goog.log');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ff.service.FishService = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.service.FishService');

  /** @private {!ff.service.XhrService} */
  this.xhrService_ = ff.service.XhrService.getInstance();

  /** @private {!Array.<!ff.model.Fish>} */
  this.fish_ = [];

  /** @private {boolean} */
  this.fishLoading_ = false;

  /** @private {boolean} */
  this.fishLoaded_ = false;
};
goog.inherits(ff.service.FishService, goog.events.EventTarget);
goog.addSingletonGetter(ff.service.FishService);


/**
 * The events dispatched from this object.
 * @enum {string}
 */
ff.service.FishService.EventType = {
  FISH_CHANGED: ff.getUniqueId('fish-changed')
};


/**
 * Loads the fish from the server.
 * @return {!goog.async.Deferred}
 */
ff.service.FishService.prototype.loadAll = function() {
  if (this.fishLoaded_) {
    throw Error('Fish have already been loaded.');
  }
  if (this.fishLoading_) {
    throw Error('Fish are already loading.');
  }

  this.fishLoading_ = true;
  goog.log.info(this.logger, 'Loading all fish.');

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
 * Gets all the fish that have been loaded so far.
 * @return {!Array.<!ff.model.Fish>}
 */
ff.service.FishService.prototype.getAll = function() {
  return this.fish_;
};


/**
 * Stores a new fish.  The server will authenticate and validate this.
 * @param {!ff.model.Fish} fish
 * @return {!goog.async.Deferred.<!ff.model.Fish>}
 */
ff.service.FishService.prototype.create = function(fish) {
  if (!this.fishLoaded_) {
    throw Error('Fish must be loaded before creating new ones.');
  }
  goog.log.info(this.logger, 'Creating new fish: ' + fish.getName());

  var deferred = this.save_(fish);
  deferred.addCallback(function(fishFromServer) {
    // Update the array.
    this.fish_.push(fishFromServer);

    // Notify everyone of changes.
    this.dispatchEvent(ff.service.FishService.EventType.FISH_CHANGED);

    return fishFromServer;
  }, this);
  return deferred;
};


/**
 * Updates an existing.  The server will authenticate and validate this.
 * @param {!ff.model.Fish} fish
 * @return {!goog.async.Deferred.<!ff.model.Fish>}
 */
ff.service.FishService.prototype.update = function(fish) {
  if (!this.fishLoaded_) {
    throw Error('Fish must be loaded before updating any.');
  }
  goog.log.info(this.logger, 'Updating fish: ' + fish.getName());

  var deferred = this.save_(fish);
  deferred.addCallback(function(fishFromServer) {
    // Update the array.
    var fishIndex = goog.array.findIndex(this.fish_, function(fish) {
      return fish.getKey() == fishFromServer.getKey();
    });
    if (fishIndex < 0) {
      throw Error('Failed to find this fish: ' + fishFromServer.getName());
    }
    this.fish_[fishIndex] = fishFromServer;

    // Notify everyone of changes.
    this.dispatchEvent(ff.service.FishService.EventType.FISH_CHANGED);

    return fishFromServer;
  }, this);
  return deferred;
};


/**
 * Saves the fish to the server.
 * @param {!ff.model.Fish} fish
 * @return {!goog.async.Deferred}
 * @private
 */
ff.service.FishService.prototype.save_ = function(fish) {
  var uri = new goog.Uri();
  uri.setPath('/admin/fish');

  var deferred = this.xhrService_.post(uri, fish.toJson(), true);

  deferred.addCallback(function(fishJson) {
    goog.log.info(this.logger, 'Fish saved.');

    try {
      var fishFromServer = ff.model.Fish.fromJson(fishJson);
    } catch (e) {
      goog.log.error(this.logger, 'Failed to build fish from JSON', e);
      throw e;
    }

    return fishFromServer;
  }, this);

  return deferred;
};


/**
 * Called when the request for all fish completes successfully.
 * @param {Object} fishesJson The JSON response.
 * @return {!Array.<!ff.model.Fish>} The parsed fish objects from the
 *     response.
 * @private
 */
ff.service.FishService.prototype.onFishLoaded_ = function(fishesJson) {
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
      goog.log.error(this.logger, 'Failed to build fish from JSON', e);
    }
  }, this);

  // Notify everyone of the change.
  this.fishLoaded_ = true;
  this.fishLoading_ = false;
  this.dispatchEvent(ff.service.FishService.EventType.FISH_CHANGED);

  // This is what is now passed in the deferred chain.
  return this.fish_;
};
