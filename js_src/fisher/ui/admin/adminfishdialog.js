/**
 * The prompt to create a new game.
 */

goog.provide('ff.fisher.ui.admin.AdminFishDialog');

goog.require('ff');
goog.require('ff.fisher.ui.admin.soy');
goog.require('ff.model.CatchPath');
goog.require('ff.model.Fish');
goog.require('ff.model.FishingTackleEnum');
goog.require('ff.model.LocationEnum');
goog.require('ff.model.Mooch');
goog.require('ff.model.WeatherEnum');
goog.require('ff.service.FishService');
goog.require('ff.ui');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.soy');
goog.require('goog.string');
goog.require('goog.structs');
goog.require('goog.structs.Set');
goog.require('goog.ui.Dialog');



/**
 * @param {ff.model.Fish=} opt_fish
 * @constructor
 * @extends {goog.ui.Dialog}
 */
ff.fisher.ui.admin.AdminFishDialog = function(opt_fish) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('ff.fisher.ui.admin.AdminFishDialog');

  /** @private {!ff.service.FishService} */
  this.fishService_ = ff.service.FishService.getInstance();

  /** @private {ff.model.Fish} */
  this.fishToEdit_ = opt_fish || null;

  var titleText = 'Create a new fish';
  if (goog.isDefAndNotNull(this.fishToEdit_)) {
    titleText = 'Edit a fish';
  }
  this.setTitle(titleText);

  this.setDisposeOnHide(true);

  var buttonSet = new goog.ui.Dialog.ButtonSet()
      .addButton({
        key: ff.fisher.ui.admin.AdminFishDialog.Id_.CONFIRM_BUTTON,
        caption: 'Save'
      }, true)
      .addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, false, true);
  this.setButtonSet(buttonSet);
};
goog.inherits(ff.fisher.ui.admin.AdminFishDialog, goog.ui.Dialog);


/**
 * @enum {string}
 * @private
 */
ff.fisher.ui.admin.AdminFishDialog.Id_ = {
  BEST_CATCH_PATH_INPUT: ff.getUniqueId('best-catch-path-input'),
  CBH_ID_INPUT: ff.getUniqueId('cbh-id-input'),
  CONFIRM_BUTTON: ff.getUniqueId('confirm-button'),
  END_HOUR_INPUT: ff.getUniqueId('end-hour-input'),
  LOCATION_INPUT: ff.getUniqueId('location-input'),
  NAME_INPUT: ff.getUniqueId('name-input'),
  PREDATOR_INPUT: ff.getUniqueId('predator-input'),
  PREDATOR_COUNT_INPUT: ff.getUniqueId('predator-count-input'),
  PREVIOUS_WEATHER_INPUT: ff.getUniqueId('previous-weather-input'),
  START_HOUR_INPUT: ff.getUniqueId('start-hour-input'),
  WEATHER_INPUT: ff.getUniqueId('weather-input')
};


/**
 * Shows the dialog.
 */
ff.fisher.ui.admin.AdminFishDialog.prototype.show = function() {
  this.setVisible(true);
};


/** @override */
ff.fisher.ui.admin.AdminFishDialog.prototype.createDom = function() {
  goog.base(this, 'createDom');

  // Don't use setContent because that requires a string.  It doesn't make sense
  // to render the template as a string just to accommodate a limitation in the
  // dialog class.
  this.getContentElement().appendChild(goog.soy.renderAsElement(
      ff.fisher.ui.admin.soy.ADMIN_FISH_DIALOG, {
        ids: this.makeIds(ff.fisher.ui.admin.AdminFishDialog.Id_)
      }));

  this.getButtonSet().getButton(
      ff.fisher.ui.admin.AdminFishDialog.Id_.CONFIRM_BUTTON);

  goog.dom.setTextContent(this.getTitleCloseElement(), 'X');

  if (goog.isDefAndNotNull(this.fishToEdit_)) {
    this.setValue_(
        ff.fisher.ui.admin.AdminFishDialog.Id_.NAME_INPUT,
        this.fishToEdit_.getName());

    // Set previous weather.
    var previousWeatherStr = '';
    var first = false;
    goog.structs.forEach(this.fishToEdit_.getPreviousWeatherSet(),
        function(weather) {
          if (!first) {
            first = true;
          } else {
            previousWeatherStr += ', ';
          }
          previousWeatherStr += weather.getName();
        });
    this.setValue_(
        ff.fisher.ui.admin.AdminFishDialog.Id_.PREVIOUS_WEATHER_INPUT,
        previousWeatherStr);

    // Set weather.
    var weatherStr = '';
    first = false;
    goog.structs.forEach(this.fishToEdit_.getWeatherSet(), function(weather) {
      if (!first) {
        first = true;
      } else {
        weatherStr += ', ';
      }
      weatherStr += weather.getName();
    });
    this.setValue_(
        ff.fisher.ui.admin.AdminFishDialog.Id_.WEATHER_INPUT,
        weatherStr);

    // Set time.
    this.setValue_(
        ff.fisher.ui.admin.AdminFishDialog.Id_.START_HOUR_INPUT,
        this.fishToEdit_.getStartHour() + '');
    this.setValue_(
        ff.fisher.ui.admin.AdminFishDialog.Id_.END_HOUR_INPUT,
        this.fishToEdit_.getEndHour() + '');

    // Set location.
    this.setValue_(
        ff.fisher.ui.admin.AdminFishDialog.Id_.LOCATION_INPUT,
        this.fishToEdit_.getLocation().getName());

    // Set best catch path.
    var bestCatchPathStr = '';
    first = false;
    goog.structs.forEach(
        this.fishToEdit_.getBestCatchPath().getCatchPathParts(),
        function(catchPathPart) {
          if (!first) {
            first = true;
          } else {
            bestCatchPathStr += ', ';
          }
          bestCatchPathStr += catchPathPart.getName();
        });
    this.setValue_(
        ff.fisher.ui.admin.AdminFishDialog.Id_.BEST_CATCH_PATH_INPUT,
        bestCatchPathStr);

    // Set the predator.
    this.setValue_(
        ff.fisher.ui.admin.AdminFishDialog.Id_.PREDATOR_INPUT,
        this.fishToEdit_.getPredator());
    var predatorCountString = '';
    if (this.fishToEdit_.getPredatorCount() > 0) {
      predatorCountString = this.fishToEdit_.getPredatorCount() + '';
    }
    this.setValue_(
        ff.fisher.ui.admin.AdminFishDialog.Id_.PREDATOR_COUNT_INPUT,
        predatorCountString);

    // Set the CBH id.
    var cbhId = this.fishToEdit_.getCbhId();
    var cbhIdStr = cbhId >= 0 ? cbhId + '' : '';
    this.setValue_(
        ff.fisher.ui.admin.AdminFishDialog.Id_.CBH_ID_INPUT,
        cbhIdStr);
  }
};


/**
 * Sets the value of the input to the given value.
 * @param {!ff.fisher.ui.admin.AdminFishDialog.Id_} id
 * @param {string} value
 * @private
 */
ff.fisher.ui.admin.AdminFishDialog.prototype.setValue_ = function(id, value) {
  ff.ui.getElementByFragment(this, id).value = value;
};


/** @override */
ff.fisher.ui.admin.AdminFishDialog.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this,
      goog.ui.Dialog.EventType.SELECT,
      this.onSelect_);
};


/** @override */
ff.fisher.ui.admin.AdminFishDialog.prototype.focus = function() {
  goog.base(this, 'focus');
  ff.ui.getElementByFragment(this,
      ff.fisher.ui.admin.AdminFishDialog.Id_.NAME_INPUT).focus();
};


/**
 * @param {!goog.ui.Dialog.Event} e
 * @private
 */
ff.fisher.ui.admin.AdminFishDialog.prototype.onSelect_ = function(e) {
  if (ff.fisher.ui.admin.AdminFishDialog.Id_.CONFIRM_BUTTON == e.key) {

    // Validate the name.
    var nameInput = ff.ui.getElementByFragment(this,
        ff.fisher.ui.admin.AdminFishDialog.Id_.NAME_INPUT);
    var name = nameInput.value;
    if (goog.string.isEmptySafe(name)) {
      nameInput.select();
      e.preventDefault();
      return;
    }

    // Validate time.
    var startHour = this.getHour_(
        ff.fisher.ui.admin.AdminFishDialog.Id_.START_HOUR_INPUT, e);
    if (startHour < 0) {
      return;
    }
    var endHour = this.getHour_(
        ff.fisher.ui.admin.AdminFishDialog.Id_.END_HOUR_INPUT, e);
    if (endHour < 0) {
      return;
    }

    // Validate the previous weather.
    var previousWeatherInput = ff.ui.getElementByFragment(this,
        ff.fisher.ui.admin.AdminFishDialog.Id_.PREVIOUS_WEATHER_INPUT);
    var previousWeatherString = previousWeatherInput.value;
    var previousWeatherSplits = previousWeatherString.split(',');
    var previousWeatherSet = new goog.structs.Set();
    var previousWeatherInvalid = false;
    goog.array.forEach(previousWeatherSplits, function(weatherSplit) {
      weatherSplit = goog.string.trim(weatherSplit);
      if (!goog.string.isEmptySafe(weatherSplit)) {
        var weather = goog.object.findValue(
            ff.model.WeatherEnum,
            function(value, key, object) {
              return goog.string.caseInsensitiveCompare(
                  value.getName(), weatherSplit) == 0;
            });
        if (weather) {
          previousWeatherSet.add(weather);
        } else {
          previousWeatherInvalid = true;
        }
      }
    });
    if (previousWeatherInvalid) {
      previousWeatherInput.select();
      e.preventDefault();
      return;
    }

    // Validate the weather.
    var weatherInput = ff.ui.getElementByFragment(this,
        ff.fisher.ui.admin.AdminFishDialog.Id_.WEATHER_INPUT);
    var weatherString = weatherInput.value;
    var weatherSplits = weatherString.split(',');
    var weatherSet = new goog.structs.Set();
    var weatherInvalid = false;
    goog.array.forEach(weatherSplits, function(weatherSplit) {
      weatherSplit = goog.string.trim(weatherSplit);
      if (!goog.string.isEmptySafe(weatherSplit)) {
        var weather = goog.object.findValue(
            ff.model.WeatherEnum,
            function(value, key, object) {
              return goog.string.caseInsensitiveCompare(
                  value.getName(), weatherSplit) == 0;
            });
        if (weather) {
          weatherSet.add(weather);
        } else {
          weatherInvalid = true;
        }
      }
    });
    if (weatherInvalid) {
      weatherInput.select();
      e.preventDefault();
      return;
    }

    // Validate location.
    var locationInput = ff.ui.getElementByFragment(
        this, ff.fisher.ui.admin.AdminFishDialog.Id_.LOCATION_INPUT);
    var locationString = locationInput.value;
    var fishLocation = goog.object.findValue(
        ff.model.LocationEnum,
        function(value, key, object) {
          return goog.string.caseInsensitiveCompare(
              value.getName(), locationString) == 0;
        });
    if (!fishLocation) {
      locationInput.select();
      e.preventDefault();
      return;
    }

    // Validate best catch path.
    var bestCatchPathInput = ff.ui.getElementByFragment(this,
        ff.fisher.ui.admin.AdminFishDialog.Id_.BEST_CATCH_PATH_INPUT);
    var bestCatchPathString = bestCatchPathInput.value;
    var bestCatchPathSplits = bestCatchPathString.split(',');
    var bestCatchPathParts = [];
    goog.array.forEach(bestCatchPathSplits, function(bestCatchPathSplit) {
      bestCatchPathSplit = goog.string.trim(bestCatchPathSplit);
      if (!goog.string.isEmptySafe(bestCatchPathSplit)) {
        var fishingTackle = goog.object.findValue(
            ff.model.FishingTackleEnum,
            function(value, key, object) {
              return goog.string.caseInsensitiveCompare(
                  value.getName(), bestCatchPathSplit) == 0;
            });
        if (fishingTackle) {
          bestCatchPathParts.push(fishingTackle);
        } else {
          bestCatchPathParts.push(new ff.model.Mooch(bestCatchPathSplit));
        }
      }
    });

    // Validate the predator.
    var predatorInput = ff.ui.getElementByFragment(this,
        ff.fisher.ui.admin.AdminFishDialog.Id_.PREDATOR_INPUT);
    var predator = predatorInput.value;
    var predatorCountInput = ff.ui.getElementByFragment(this,
        ff.fisher.ui.admin.AdminFishDialog.Id_.PREDATOR_COUNT_INPUT);
    var predatorCountString = predatorCountInput.value;
    var predatorCount = 0;
    if (!goog.string.isEmptySafe(predator) &&
        !goog.string.isEmptySafe(predatorCountString)) {
      // Both have values have something set, so parse.
      predatorCount = this.parseInt_(predatorCountString);
      if (predatorCount < 0) {
        // Failed to parse.
        predatorCountInput.select();
        e.preventDefault();
        return;
      } // Else, valid predator fields.
    } else if (!goog.string.isEmptySafe(predator) ||
        !goog.string.isEmptySafe(predatorCountString)) {
      // Only one of them is set, so automatically invalid.
      predatorInput.select();
      e.preventDefault();
      return;
    } // Else, nothing set: valid predator fields.

    // Validate the CBH ID.
    var cbhIdInput = ff.ui.getElementByFragment(this,
        ff.fisher.ui.admin.AdminFishDialog.Id_.CBH_ID_INPUT);
    var cbhIdString = cbhIdInput.value;
    var cbhId = -1;
    if (!goog.string.isEmptySafe(cbhIdString)) {
      try {
        cbhId = parseInt(cbhIdString, 10);
      } catch (error) {
        predatorInput.select();
        e.preventDefault();
        return;
      }
    }

    // Create the fish with the given data.
    var fishKey = this.fishToEdit_ ? this.fishToEdit_.getKey() : '';
    var fish = new ff.model.Fish(
        fishKey,
        name,
        previousWeatherSet,
        weatherSet,
        startHour,
        endHour,
        fishLocation,
        new ff.model.CatchPath(bestCatchPathParts),
        predator,
        predatorCount,
        cbhId);

    // Save the fish.
    if (this.fishToEdit_) {
      this.fishService_.update(fish);
    } else {
      this.fishService_.create(fish);
    }
  }
  this.setVisible(false);
};


/**
 * Gets the hour value from the given input.
 * @param {!ff.fisher.ui.admin.AdminFishDialog.Id_} id The id of the input.
 * @param {!goog.ui.Dialog.Event} e The submit event.
 * @return {number} The hour from the input or -1 if parse failed.
 * @private
 */
ff.fisher.ui.admin.AdminFishDialog.prototype.getHour_ = function(id, e) {
  var input = ff.ui.getElementByFragment(this, id);
  var string = input.value;

  var hour = this.parseInt_(string);
  if (hour >= 0 && hour <= 24) {
    return hour;
  }

  // Invalid so cancel.
  input.select();
  e.preventDefault();
  return -1;
};


/**
 * Gets the number value from the given string.
 * @param {string} string The text to parse.
 * @return {number} The parsed number or -1 if parse failed.
 * @private
 */
ff.fisher.ui.admin.AdminFishDialog.prototype.parseInt_ = function(string) {
  try {
    return parseInt(string, 10);
  } catch (error) {
    return -1;
  }
};
