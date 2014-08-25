/**
 * The set of top-level utilities that are useful to the entire application.
 */

goog.provide('ff');
goog.provide('low');

goog.require('goog.events');
goog.require('goog.object');
goog.require('goog.string');


/**
 * Creates a unique event id.  This is a convenient alias.
 * @param {string} identifier The identifier.
 * @return {string} A unique identifier.
 */
ff.getUniqueId = goog.events.getUniqueId;


/**
 * Converts the string to the given enum type by doing a case-insensitive
 * comparison on the enum values.  If the string isn't in the enum, null is
 * returned.
 * @param {string} string
 * @param {!Object} enumObj
 * @return {*} The enum for the string or null if not found in the enum.
 */
ff.stringToEnum = function(string, enumObj) {
  return goog.object.findValue(
      enumObj,
      function(value, key, object) {
        return goog.string.caseInsensitiveCompare(value, string) == 0;
      });
};
