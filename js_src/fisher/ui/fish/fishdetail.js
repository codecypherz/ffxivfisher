/**
 * Renders the detail of a single fish.
 */

goog.provide('ff.fisher.ui.fish.FishDetail');

goog.require('ff');
goog.require('ff.fisher.ui.fish.soy');
goog.require('ff.fisher.ui.weather.WeatherIcon');
goog.require('ff.ui');
goog.require('goog.dom');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.structs');
goog.require('goog.ui.Component');



/**
 * @param {!ff.model.Fish} fish
 * @constructor
 * @extends {goog.ui.Component}
 */
ff.fisher.ui.fish.FishDetail = function(fish) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.fish.FishDetail');

  /** @private {!ff.model.Fish} */
  this.fish_ = fish;
};
goog.inherits(ff.fisher.ui.fish.FishDetail, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.fish.FishDetail.Id_ = {
  CURRENT_WEATHER: ff.getUniqueId('current-weather'),
  PREDATOR_INFO: ff.getUniqueId('predator-info'),
  PREVIOUS_WEATHER: ff.getUniqueId('previous-weather')
};


/** @override */
ff.fisher.ui.fish.FishDetail.prototype.createDom = function() {
  // Render soy template.
  this.setElementInternal(goog.soy.renderAsElement(
      ff.fisher.ui.fish.soy.FISH_DETAIL, {
        ids: this.makeIds(ff.fisher.ui.fish.FishDetail.Id_)
      }));

  // Previous weather.
  this.renderWeather_(
      ff.ui.getElementByFragment(
          this, ff.fisher.ui.fish.FishDetail.Id_.PREVIOUS_WEATHER),
      this.fish_.getPreviousWeatherSet());

  // Current weather.
  this.renderWeather_(
      ff.ui.getElementByFragment(
          this, ff.fisher.ui.fish.FishDetail.Id_.CURRENT_WEATHER),
      this.fish_.getWeatherSet());

  // Predator information.
  var predatorInfoElement = ff.ui.getElementByFragment(
      this, ff.fisher.ui.fish.FishDetail.Id_.PREDATOR_INFO);
  var predatorText = 'No predator requirement';
  if (this.fish_.getPredatorCount() > 0) {
    predatorText = 'Must catch ' + this.fish_.getPredatorCount() +
        ' ' + this.fish_.getPredator();
  }
  goog.dom.setTextContent(predatorInfoElement, predatorText);
};


/**
 * Renders the weather set into the given element.
 * @param {Element} element The element in which to render weather.
 * @param {!goog.structs.Set} weatherSet The weather to render.
 * @private
 */
ff.fisher.ui.fish.FishDetail.prototype.renderWeather_ = function(
    element, weatherSet) {
  if (weatherSet.isEmpty()) {
    goog.dom.setTextContent(element, 'Any weather');
  } else {
    goog.structs.forEach(weatherSet, function(weather) {
      var weatherIcon = new ff.fisher.ui.weather.WeatherIcon(weather);
      this.addChild(weatherIcon);
      weatherIcon.render(element);
    }, this);
  }
};
