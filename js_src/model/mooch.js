
goog.provide('ff.model.Mooch');

goog.require('ff.model.CatchPathPart');
goog.require('ff.model.Image');



/**
 * @param {string} fishName
 * @constructor
 * @implements {ff.model.CatchPathPart}
 */
ff.model.Mooch = function(fishName) {

  /** @private {string} */
  this.fishName_ = fishName;
};


/**
 * @type {!Object.<string, number>}
 * @private
 * @const
 */
ff.model.Mooch.NAME_TO_CBH_ID_ = {
  'Abalathian Smelt': 24,
  'Ala Mhigan Fighting Fish': 31,
  'Assassin Betta': 130,
  'Cloud Cutter': 134,
  'Common Sculpin': 119,
  'Copperfish': 41,
  'Giant Squid': 169,
  'Goldfish': 146,
  'Harbor Herring': 15,
  'Merlthor Goby': 4,
  'Ocean Cloud': 12,
  'Ogre Barracuda': 58,
  'Silverfish': 90,
  'Storm Rider': 102,
  'Striped Goby': 6
};


/** @override */
ff.model.Mooch.prototype.getName = function() {
  return this.fishName_;
};


/** @override */
ff.model.Mooch.prototype.getImageUrl = function() {
  return ff.model.Image.getUrl('fish/30_30', this.fishName_);
};


/**
 * @param {!ff.service.FishService} fishService
 * @return {string}
 */
ff.model.Mooch.prototype.getDetailUrl = function(fishService) {
  var fish = fishService.findFishByName(this.fishName_);
  if (fish) {
    return fish.getDetailUrl();
  } else {
    // Hack!
    var cbhId = ff.model.Mooch.NAME_TO_CBH_ID_[this.fishName_];
    return 'http://en.ff14angler.com/fish/' + cbhId;
  }
};


/**
 * Converts the fish to JSON.
 * @return {!Object}
 */
ff.model.Mooch.prototype.toJson = function() {
  return {
    'fishName': this.fishName_
  };
};
