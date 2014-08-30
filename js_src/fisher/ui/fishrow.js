/**
 * Renders a single fish in a row format.
 */

goog.provide('ff.fisher.ui.FishRow');

goog.require('ff');
goog.require('ff.fisher.ui.WeatherIcon');
goog.require('ff.fisher.ui.soy');
goog.require('ff.ui');
goog.require('goog.soy');
goog.require('goog.structs');
goog.require('goog.ui.Component');



/**
 * @param {!ff.model.Fish} fish
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.FishRow = function(fish) {
  goog.base(this);

  /** @private {!ff.model.Fish} */
  this.fish_ = fish;
};
goog.inherits(ff.fisher.ui.FishRow, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.FishRow.Id_ = {
  NAME: ff.getUniqueId('name'),
  TIME: ff.getUniqueId('time'),
  WEATHER: ff.getUniqueId('weather')
};


/** @override */
ff.fisher.ui.FishRow.prototype.createDom = function() {
  // Render soy template.
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.soy.FISH_ROW, {
        ids: this.makeIds(ff.fisher.ui.FishRow.Id_),
        name: this.fish_.getName()
      }));

  // TODO Render Time component.

  // Render weather.
  var weatherElement = ff.ui.getElementByFragment(
      this, ff.fisher.ui.FishRow.Id_.WEATHER);
  goog.structs.forEach(this.fish_.getWeatherSet(), function(weather) {
    var weatherIcon = new ff.fisher.ui.WeatherIcon(weather);
    this.addChild(weatherIcon);
    weatherIcon.render(weatherElement);
  }, this);
};
