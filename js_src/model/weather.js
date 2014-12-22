
goog.provide('ff.model.Weather');
goog.provide('ff.model.WeatherEnum');

goog.require('goog.object');



/**
 * @param {number} clientIdentifier
 * @param {string} name
 * @constructor
 */
ff.model.Weather = function(clientIdentifier, name) {

  /** @private {number} */
  this.clientIdentifier_ = clientIdentifier;

  /** @private {string} */
  this.name_ = name;
};


/** @return {number} */
ff.model.Weather.prototype.getClientIdentifier = function() {
  return this.clientIdentifier_;
};


/** @return {string} */
ff.model.Weather.prototype.getName = function() {
  return this.name_;
};


/**
 * Figures out the enum given the identifier.
 * @param {number} identifier
 * @return {!ff.model.Weather}
 */
ff.model.Weather.getFromIdentifier = function(identifier) {
  var weather = goog.object.findValue(
      ff.model.WeatherEnum,
      function(value, key, object) {
        return value.getClientIdentifier() == identifier;
      });
  if (!weather) {
    throw Error('Unable to find WeatherEnum for identifier ' + identifier);
  }
  return weather;
};


/**
 * The set of weather types.
 * @enum {!ff.model.Weather}
 */
ff.model.WeatherEnum = {
  'AURORA': new ff.model.Weather(0, 'Aurora'),
  'BLIZZARDS': new ff.model.Weather(1, 'Blizzards'),
  'CLEAR': new ff.model.Weather(2, 'Clear Skies'),
  'DARKNESS': new ff.model.Weather(3, 'Darkness'),
  'DUST_STORMS': new ff.model.Weather(4, 'Dust Storms'),
  'ERUPTIONS': new ff.model.Weather(5, 'Eruptions'),
  'FAIR': new ff.model.Weather(6, 'Sunshine'),
  'FOG': new ff.model.Weather(7, 'Fog'),
  'GALES': new ff.model.Weather(8, 'Gales'),
  'GLOOM': new ff.model.Weather(9, 'Gloom'),
  'HEAT_WAVE': new ff.model.Weather(10, 'Heat Wave'),
  'HOPELESSNESS': new ff.model.Weather(11, 'Hopelessness'),
  'HOT_SPELLS': new ff.model.Weather(12, 'Hot Spells'),
  'LOUR': new ff.model.Weather(13, 'Lour'),
  'OVERCAST': new ff.model.Weather(14, 'Clouds'),
  'RAIN': new ff.model.Weather(15, 'Rain'),
  'SANDSTORMS': new ff.model.Weather(16, 'Sandstorms'),
  'SHOWERS': new ff.model.Weather(17, 'Showers'),
  'SNOW': new ff.model.Weather(18, 'Snow'),
  'STORM_CLOUDS': new ff.model.Weather(19, 'Storm Clouds'),
  'THUNDER': new ff.model.Weather(20, 'Thunder'),
  'THUNDERSTORMS': new ff.model.Weather(21, 'Thunderstorms'),
  'TORRENTIAL': new ff.model.Weather(22, 'Torrential'),
  'WIND': new ff.model.Weather(23, 'Wind')
};
