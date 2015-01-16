/**
 * Service for interacting with cookies.
 */

goog.provide('ff.service.CookieService');

goog.require('goog.dom');
goog.require('goog.log');
goog.require('goog.net.Cookies');



/**
 * @constructor
 */
ff.service.CookieService = function() {

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.service.CookieService');

  /** @private {!goog.net.Cookies} */
  this.cookies_ = new goog.net.Cookies(goog.dom.getDocument());
};
goog.addSingletonGetter(ff.service.CookieService);


/**
 * Arbitrarily long expiration to make sure cookies are persistent.
 * @private
 * @const
 * @type {number}
 */
ff.service.CookieService.EXPIRATION_ = 60 * 60 * 24 * 30 * 12 * 10;


/**
 * Gets the cookie identified by the name.
 * @param {string} cookieName
 * @param {string=} opt_default If not found this is returned instead.
 * @return {string|undefined}
 */
ff.service.CookieService.prototype.get = function(cookieName, opt_default) {
  return this.cookies_.get(cookieName, opt_default);
};


/**
 * Sets the new cookie value.
 * @param {string} cookieName
 * @param {string} value
 */
ff.service.CookieService.prototype.set = function(cookieName, value) {
  // Set all cookies as persistent cookies.
  this.cookies_.set(cookieName, value, ff.service.CookieService.EXPIRATION_);
};


/**
 * Removes the given cooke.
 * @param {string} cookieName
 */
ff.service.CookieService.prototype.remove = function(cookieName) {
  this.cookies_.remove(cookieName);
};
