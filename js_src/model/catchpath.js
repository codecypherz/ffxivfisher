
goog.provide('ff.model.CatchPath');

goog.require('ff');
goog.require('ff.model.FishingTackleEnum');
goog.require('ff.model.Mooch');
goog.require('goog.array');



/**
 * @param {!Array.<!ff.model.CatchPathPart>} catchPathParts
 * @constructor
 */
ff.model.CatchPath = function(catchPathParts) {

  /** @private {!Array.<!ff.model.CatchPathPart>} */
  this.catchPathParts_ = catchPathParts;
};


/** @return {!Array.<!ff.model.CatchPathPart>} */
ff.model.CatchPath.prototype.getCatchPathParts = function() {
  return this.catchPathParts_;
};


/**
 * Converts the fish to JSON.
 * @return {!Object}
 */
ff.model.CatchPath.prototype.toJson = function() {
  var jsonArr = [];

  goog.array.forEach(this.catchPathParts_, function(catchPathPart) {
    jsonArr.push(catchPathPart.toJson());
  });

  return jsonArr;
};


/**
 * @param {!Array.<!Object>} jsonArr The JSON for a catch path object.
 * @return {!ff.model.CatchPath} The parsed catch path model.
 */
ff.model.CatchPath.fromJson = function(jsonArr) {
  var catchPathParts = [];

  goog.array.forEach(jsonArr, function(json) {
    var fishingTackleKey = json['fishingTackle'];
    var fishName = json['fishName'];

    if (fishingTackleKey) {
      var fishingTackle = ff.stringKeyToEnum(
          fishingTackleKey, ff.model.FishingTackleEnum);
      if (!fishingTackle) {
        throw Error('Unknown fishing tackle: ' + fishingTackleKey);
      }

      catchPathParts.push(ff.model.FishingTackleEnum[fishingTackle]);
    } else if (fishName) {
      catchPathParts.push(new ff.model.Mooch(fishName));
    }
  });

  return new ff.model.CatchPath(catchPathParts);
};
