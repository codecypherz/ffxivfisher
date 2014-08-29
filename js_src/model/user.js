/**
 * Model for the current user.
 */

goog.provide('ff.model.User');

goog.require('goog.events.EventTarget');
goog.require('goog.json');
goog.require('goog.log');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ff.model.User = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.model.User');

  /**
   * The name of the user.
   * @private {string}
   */
  this.name_ = '';

  /**
   * The user's email address.
   * @private {string}
   */
  this.email_ = '';

  /**
   * Whether the user is signed in or not.
   * @private {boolean}
   */
  this.signedIn_ = false;

  /**
   * Whether the user is an administrator or not.
   * @private {boolean}
   */
  this.admin_ = false;

  /**
   * True if the user's data has been parsed, false otherwise.
   * @private {boolean}
   */
  this.parsed_ = false;
};
goog.inherits(ff.model.User, goog.events.EventTarget);
goog.addSingletonGetter(ff.model.User);


/**
 * Parses the json into values.
 * @param {string} userJson
 */
ff.model.User.prototype.parse = function(userJson) {
  if (this.parsed_) {
    throw Error('User data has already been parsed.');
  }

  try {
    var json = goog.json.parse(userJson);

    this.name_ = json['name'] || '';
    this.email_ = json['email'] || '';
    this.signedIn_ = json['signedIn'] || false;
    this.admin_ = json['admin'] || false;

    if (!this.signedIn_ && this.admin_) {
      throw Error('Cannot be admin while not signed in.');
    }

    this.parsed_ = true;

  } catch (e) {
    this.logger.severe('Failed to parse the user json.', e);
  }
};


/** @return {string} */
ff.model.User.prototype.getName = function() {
  return this.name_;
};


/** @return {string} */
ff.model.User.prototype.getEmail = function() {
  return this.email_;
};


/** @return {boolean} */
ff.model.User.prototype.isSignedIn = function() {
  return this.signedIn_;
};


/** @return {boolean} */
ff.model.User.prototype.isAdmin = function() {
  return this.admin_;
};
