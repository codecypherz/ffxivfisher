goog.provide('ff.model.FishingTackle');

goog.require('ff.model.CatchPathPart');
goog.require('ff.model.Image');
goog.require('goog.object');
goog.require('goog.string');
goog.provide('ff.model.FishingTackleEnum');



/**
 * @param {string} name
 * @param {!ff.model.FishingTackle.Type} type
 * @param {number} itemLevel
 * @constructor
 * @implements {ff.model.CatchPathPart}
 */
ff.model.FishingTackle = function(name, type, itemLevel) {

  /** @private {string} */
  this.name_ = name;

  /** @private {!ff.model.FishingTackle.Type} */
  this.type_ = type;

  /** @private {number} */
  this.itemLevel_ = itemLevel;
};


/**
 * @enum {string}
 */
ff.model.FishingTackle.Type = {
  'BAIT': 'Bait',
  'LURE': 'Lure'
};


/** @return {string} */
ff.model.FishingTackle.prototype.getName = function() {
  return this.name_;
};


/** @return {!ff.model.FishingTackle.Type} */
ff.model.FishingTackle.prototype.getType = function() {
  return this.type_;
};


/** @return {number} */
ff.model.FishingTackle.prototype.getItemLevel = function() {
  return this.itemLevel_;
};


/** @return {string} */
ff.model.FishingTackle.prototype.getImageUrl = function() {
  return ff.model.Image.getUrl('tackle', this.name_);
};


/**
 * Converts the fish to JSON.
 * @return {!Object}
 */
ff.model.FishingTackle.prototype.toJson = function() {

  var fishingTackleKey = goog.object.findKey(
      ff.model.FishingTackleEnum,
      function(value, key, object) {
        return goog.string.caseInsensitiveCompare(
            value.getName(), this.name_) == 0;
      }, this);

  return {
    'fishingTackle': fishingTackleKey
  };
};


/**
 * @enum {!ff.model.FishingTackle}
 */
ff.model.FishingTackleEnum = {
  'MOTH_PUPA': new ff.model.FishingTackle(
      'Moth Pupa', ff.model.FishingTackle.Type.BAIT, 1),
  'LUGWORM': new ff.model.FishingTackle(
      'Lugworm', ff.model.FishingTackle.Type.BAIT, 1),
  'CRAYFISH_BALL': new ff.model.FishingTackle(
      'Crayfish Ball', ff.model.FishingTackle.Type.BAIT, 5),
  'PILL_BUG': new ff.model.FishingTackle(
      'Pill Bug', ff.model.FishingTackle.Type.BAIT, 5),
  'GOBY_BALL': new ff.model.FishingTackle(
      'Goby Ball', ff.model.FishingTackle.Type.BAIT, 10),
  'BLOODWORM': new ff.model.FishingTackle(
      'Bloodworm', ff.model.FishingTackle.Type.BAIT, 10),
  'MIDGE_BASKET': new ff.model.FishingTackle(
      'Midge Basket', ff.model.FishingTackle.Type.BAIT, 15),
  'RAT_TAIL': new ff.model.FishingTackle(
      'Rat Tail', ff.model.FishingTackle.Type.BAIT, 15),
  'CRAB_BALL': new ff.model.FishingTackle(
      'Crab Ball', ff.model.FishingTackle.Type.BAIT, 20),
  'CROW_FLY': new ff.model.FishingTackle(
      'Crow Fly', ff.model.FishingTackle.Type.LURE, 20),

  'BUTTERWORM': new ff.model.FishingTackle(
      'Butterworm', ff.model.FishingTackle.Type.BAIT, 20),
  'FLOATING_MINNOW': new ff.model.FishingTackle(
      'Floating Minnow', ff.model.FishingTackle.Type.LURE, 22),
  'BRASS_SPOON_LURE': new ff.model.FishingTackle(
      'Brass Spoon Lure', ff.model.FishingTackle.Type.LURE, 23),
  'SHRIMP_CAGE_FEEDER': new ff.model.FishingTackle(
      'Shrimp Cage Feeder', ff.model.FishingTackle.Type.BAIT, 25),
  'BASS_BALL': new ff.model.FishingTackle(
      'Bass Ball', ff.model.FishingTackle.Type.BAIT, 25),
  'CHOCOBO_FLY': new ff.model.FishingTackle(
      'Chocobo Fly', ff.model.FishingTackle.Type.LURE, 27),
  'SPOON_WORM': new ff.model.FishingTackle(
      'Spoon Worm', ff.model.FishingTackle.Type.BAIT, 30),
  'SYRPHID_BASKET': new ff.model.FishingTackle(
      'Syrphid Basket', ff.model.FishingTackle.Type.BAIT, 30),
  'SILVER_SPOON_LURE': new ff.model.FishingTackle(
      'Silver Spoon Lure', ff.model.FishingTackle.Type.LURE, 32),
  'STEEL_JIG': new ff.model.FishingTackle(
      'Steel Jig', ff.model.FishingTackle.Type.LURE, 32),

  'SINKING_MINNOW': new ff.model.FishingTackle(
      'Sinking Minnow', ff.model.FishingTackle.Type.LURE, 34),
  'SAND_LEECH': new ff.model.FishingTackle(
      'Sand Leech', ff.model.FishingTackle.Type.BAIT, 35),
  'HONEY_WORM': new ff.model.FishingTackle(
      'Honey Worm', ff.model.FishingTackle.Type.BAIT, 35),
  'HERRING_BALL': new ff.model.FishingTackle(
      'Herring Ball', ff.model.FishingTackle.Type.BAIT, 35),
  'WILDFOWL_FLY': new ff.model.FishingTackle(
      'Wildfowl Fly', ff.model.FishingTackle.Type.LURE, 36),
  'HEAVY_STEEL_JIG': new ff.model.FishingTackle(
      'Heavy Steel Jig', ff.model.FishingTackle.Type.LURE, 37),
  'SPINNER': new ff.model.FishingTackle(
      'Spinner', ff.model.FishingTackle.Type.LURE, 39),
  'KRILL_CAGE_FEEDER': new ff.model.FishingTackle(
      'Krill Cage Feeder', ff.model.FishingTackle.Type.BAIT, 40),
  'SAND_GECKO': new ff.model.FishingTackle(
      'Sand Gecko', ff.model.FishingTackle.Type.BAIT, 40),
  'STEM_BORER': new ff.model.FishingTackle(
      'Stem Borer', ff.model.FishingTackle.Type.BAIT, 40),

  'MYTHRIL_SPOON_LURE': new ff.model.FishingTackle(
      'Mythril Spoon Lure', ff.model.FishingTackle.Type.LURE, 41),
  'SNURBLE_FLY': new ff.model.FishingTackle(
      'Snurble Fly', ff.model.FishingTackle.Type.LURE, 43),
  'TOPWATER_FROG': new ff.model.FishingTackle(
      'Topwater Frog', ff.model.FishingTackle.Type.LURE, 44),
  'GLOWWORM': new ff.model.FishingTackle(
      'Glowworm', ff.model.FishingTackle.Type.BAIT, 45),
  'HOVERWORM': new ff.model.FishingTackle(
      'Hoverworm', ff.model.FishingTackle.Type.BAIT, 45),
  'ROLLING_STONE': new ff.model.FishingTackle(
      'Rolling Stone', ff.model.FishingTackle.Type.BAIT, 45),
  'RAINBOW_SPOON_LURE': new ff.model.FishingTackle(
      'Rainbow Spoon Lure', ff.model.FishingTackle.Type.LURE, 46),
  'SPINNERBAIT': new ff.model.FishingTackle(
      'Spinnerbait', ff.model.FishingTackle.Type.LURE, 47),
  'STREAMER': new ff.model.FishingTackle(
      'Streamer', ff.model.FishingTackle.Type.LURE, 48),
  'YUMIZUNO': new ff.model.FishingTackle(
      'Yumizuno', ff.model.FishingTackle.Type.LURE, 48),

  'CADDISFLY_LARVA': new ff.model.FishingTackle(
      'Caddisfly Larva', ff.model.FishingTackle.Type.BAIT, 50),
  'NORTHERN_KRILL': new ff.model.FishingTackle(
      'Northern Krill', ff.model.FishingTackle.Type.BAIT, 50),
  'BALLOON_BUG': new ff.model.FishingTackle(
      'Balloon Bug', ff.model.FishingTackle.Type.BAIT, 50)
};
