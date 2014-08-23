/**
 * Provides a service for shared XHR functionality such as the manager.
 */

goog.provide('ff.service.Xhr');

goog.require('goog.Disposable');
goog.require('goog.async.Deferred');
goog.require('goog.events.EventHandler');
goog.require('goog.log');
goog.require('goog.net.EventType');
goog.require('goog.net.XhrManager');
goog.require('goog.ui.IdGenerator');



/**
 * @constructor
 * @extends {goog.Disposable}
 */
ff.service.Xhr = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.service.Xhr');

  /**
   * Generator for unique IDs to be used for requests on the XHR manager.
   * @private {!goog.ui.IdGenerator}
   */
  this.idGenerator_ = goog.ui.IdGenerator.getInstance();

  /** @private {!goog.net.XhrManager} */
  this.xhrManager_ = new goog.net.XhrManager();
  this.registerDisposable(this.xhrManager_);

  /** @private {!Object.<!goog.async.Deferred>} */
  this.pendingMap_ = {};

  var handler = new goog.events.EventHandler(this);
  this.registerDisposable(handler);

  handler.listen(this.xhrManager_,
      goog.net.EventType.ERROR,
      this.onError_);
  handler.listen(this.xhrManager_,
      goog.net.EventType.SUCCESS,
      this.onSuccess_);
};
goog.inherits(ff.service.Xhr, goog.Disposable);
goog.addSingletonGetter(ff.service.Xhr);


/**
 * Sends a GET request to the given URI.
 * @param {!goog.Uri} uri The URI to which to make the request.
 * @param {boolean=} opt_processJsonResponse True if a JSON response is expected
 *     and should be processed.  If so, then the value passed in the callback
 *     will be the validated JSON.
 * @return {!goog.async.Deferred.<!goog.net.XhrManager.Event>} The callback
 *     happens after the send completes successfully and the errback happens if
 *     an error occurs.
 */
ff.service.Xhr.prototype.get = function(uri, opt_processJsonResponse) {
  var deferred = new goog.async.Deferred();

  var requestId = this.idGenerator_.getNextUniqueId();
  this.xhrManager_.send(requestId, uri.toString());
  this.pendingMap_[requestId] = deferred;

  if (opt_processJsonResponse) {
    deferred.addCallback(this.processJsonResponse_, this);
  }

  return deferred;
};


/**
 * Sends a POST request to the given URI.
 * @param {!goog.Uri} uri The URI to which to make the request.
 * @param {string|null|undefined} opt_json The json to post.
 * @param {boolean=} opt_processJsonResponse True if a JSON response is expected
 *     and should be processed.  If so, then the value passed in the callback
 *     will be the validated JSON.
 * @return {!goog.async.Deferred.<!goog.net.XhrManager.Event>} The callback
 *     happens after the send completes successfully and the errback happens if
 *     an error occurs.
 */
ff.service.Xhr.prototype.post = function(
    uri, opt_json, opt_processJsonResponse) {
  var deferred = new goog.async.Deferred();

  var requestId = this.idGenerator_.getNextUniqueId();

  this.xhrManager_.send(requestId, uri.toString(), 'POST', opt_json);
  this.pendingMap_[requestId] = deferred;

  if (opt_processJsonResponse) {
    deferred.addCallback(this.processJsonResponse_, this);
  }

  return deferred;
};


/**
 * Called when an XHR request fails.
 * @param {!goog.net.XhrManager.Event} e
 * @private
 */
ff.service.Xhr.prototype.onError_ = function(e) {
  goog.log.error(this.logger, 'XHR failed');
  var deferred = this.pendingMap_[e.id];
  if (deferred) {
    deferred.errback(e);
    delete this.pendingMap_[e.id];
  } else {
    goog.log.error(this.logger, 'No deferred for failed request.');
  }
};


/**
 * Called when an XHR request succeeds.
 * @param {!goog.net.XhrManager.Event} e
 * @private
 */
ff.service.Xhr.prototype.onSuccess_ = function(e) {
  var deferred = this.pendingMap_[e.id];
  if (deferred) {
    deferred.callback(e);
    delete this.pendingMap_[e.id];
  } else {
    goog.log.error(this.logger, 'No deferred for successful request.');
  }
};


/**
 * Handles common JSON validation to response processing.  If the result is
 * valid, the next callback in the deferred chain will have the extracted JSON
 * string.
 * @param {!goog.net.XhrManager.Event} event
 * @return {!Object} The JSON from the response.
 * @private
 */
ff.service.Xhr.prototype.processJsonResponse_ = function(event) {

  // First, get the JSON from the response which can throw an error.
  var responseJson;
  try {
    responseJson = event.xhrIo.getResponseJson();
  } catch (e) {
    goog.log.error(this.logger, 'Failed to get response JSON', e);
    throw e;
  }

  // Next, make sure it's not empty.
  if (!responseJson) {
    var errorMsg = 'No JSON in the response.';
    goog.log.error(this.logger, errorMsg);
    throw Error(errorMsg);
  }

  // Finally, return the validated JSON.  This is now passed to the next
  // callback in the deferred chain.
  return responseJson;
};
