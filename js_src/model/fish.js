
goog.provide('ff.model.Fish');

goog.require('goog.events.EventTarget');



/**
 * The model for a fish.
 * @param {string} key
 * @param {string} name
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ff.model.Fish = function(key, name) {
  goog.base(this);

  /** @private {string} */
  this.key_ = key;

  /** @private {string} */
  this.name_ = name;
};
goog.inherits(ff.model.Fish, goog.events.EventTarget);


/**
 * @return {string}
 */
ff.model.Fish.prototype.getKey = function() {
  return this.key_;
};


/**
 * @return {string}
 */
ff.model.Fish.prototype.getName = function() {
  return this.name_;
};


/**
 * @param {!Object} json The JSON for a fish object.
 * @return {!ff.model.Fish} The parsed fish model.
 */
ff.model.Fish.fromJson = function(json) {
  return new ff.model.Fish(
      json['key'],
      json['name']);
};
