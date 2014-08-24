
goog.provide('ff.model.Weather');

goog.require('goog.object');
goog.require('goog.string');


/**
 * The set of weather types.
 * @enum {string}
 */
ff.model.Weather = {
  AURORA: 'Aurora',
  BLIZZARDS: 'Blizzards',
  CLEAR: 'Clear',
  DARKNESS: 'Darkness',
  DUST_STORMS: 'Dust Storms',
  ERUPTIONS: 'Eruptions',
  FAIR: 'Fair',
  FOG: 'Fog',
  GALES: 'Gales',
  GLOOM: 'Gloom',
  HEAT_WAVE: 'Heat Wave',
  HOPELESSNESS: 'Hopelessness',
  HOT_SPELLS: 'Hot Spells',
  LOUR: 'Lour',
  OVERCAST: 'Overcast',
  RAIN: 'Rain',
  SANDSTORMS: 'Sandstorms',
  SHOWERS: 'Showers',
  SNOW: 'Snow',
  STORM_CLOUDS: 'Storm Clouds',
  THUNDER: 'Thunder',
  THUNDERSTORM: 'Thunderstorm',
  TORRENTIAL: 'Torrential',
  WIND: 'Wind'
};


/**
 * Tries to find a matching type for the string.
 * @param {string} typeString The string to match.
 * @return {ff.model.Weather} The type or undefined if not found.
 */
ff.model.Weather.getFromString = function(typeString) {
  return /** @type {ff.model.Weather} */ (goog.object.findValue(
      ff.model.Weather,
      function(value, key, object) {
        return goog.string.caseInsensitiveCompare(value, typeString) == 0;
      }));
};
