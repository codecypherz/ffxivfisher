
goog.provide('ff.model.Location');

goog.require('ff.model.AreaEnum');
goog.provide('ff.model.LocationEnum');



/**
 * @param {!ff.model.Area} area
 * @param {string} name
 * @param {number} cbhId
 * @constructor
 */
ff.model.Location = function(area, name, cbhId) {

  /** @private {!ff.model.Area} */
  this.area_ = area;

  /** @private {string} */
  this.name_ = name;

  /** @private {number} */
  this.cbhId_ = cbhId;
};


/** @return {!ff.model.Area} */
ff.model.Location.prototype.getArea = function() {
  return this.area_;
};


/** @return {string} */
ff.model.Location.prototype.getName = function() {
  return this.name_;
};


/** @return {string} */
ff.model.Location.prototype.getDetailUrl = function() {
  return 'http://en.ff14angler.com/spot/' + this.cbhId_;
};


/**
 * @enum {!ff.model.Location}
 */
ff.model.LocationEnum = {

  // Limsa Lominsa Upper Decks
  'LIMSA_LOMINSA_UPPER_DECKS': new ff.model.Location(
      ff.model.AreaEnum.LIMSA_LOMINSA_UPPER_DECKS,
      'Limsa Lominsa Upper Decks', 10101),

  // Limsa Lominsa Lower Decks
  'LIMSA_LOMINSA_LOWER_DECKS': new ff.model.Location(
      ff.model.AreaEnum.LIMSA_LOMINSA_LOWER_DECKS,
      'Limsa Lominsa Lower Decks', 10201),

  // Middle La Noscea
  'ZEPHYR_DRIFT': new ff.model.Location(
      ff.model.AreaEnum.MIDDLE_LA_NOSCEA, 'Zephyr Drift', 10301),
  'ROGUE_RIVER': new ff.model.Location(
      ff.model.AreaEnum.MIDDLE_LA_NOSCEA, 'Rogue River', 10302),
  'WEST_AGELYSS_RIVER': new ff.model.Location(
      ff.model.AreaEnum.MIDDLE_LA_NOSCEA, 'West Agelyss River', 10303),
  'SUMMERFORD': new ff.model.Location(
      ff.model.AreaEnum.MIDDLE_LA_NOSCEA, 'Summerford', 10304),
  'NYM_RIVER': new ff.model.Location(
      ff.model.AreaEnum.MIDDLE_LA_NOSCEA, 'Nym River', 10305),
  'WOAD_WHISPER_CANYON': new ff.model.Location(
      ff.model.AreaEnum.MIDDLE_LA_NOSCEA, 'Woad Whisper Canyon', 10306),

  // Lower La Noscea
  'THE_MOURNING_WIDOW': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'The Mourning Widow', 10401),
  'MORABY_BAY': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'Moraby Bay', 10402),
  'CEDARWOOD': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'Cedarwood', 10403),
  'MORABY_DRYDOCKS': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'Moraby Drydocks', 10404),
  'OSCHONS_TORCH': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'Oschon\'s Torch', 10405),
  'THE_SALT_STRAND': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'The Salt Strand', 10406),
  'CANDLEKEEP_QUAY': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'Candlekeep Quay', 10407),
  'EMPTY_HEART': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'Empty Heart', 10408),
  'BLIND_IRON_MINES': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'Blind Iron Mines', 10409),

  // Eastern La Noscea
  'SOUTH_BLOODSHORE': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'South Bloodshore', 10501),
  'COSTA_DEL_SOL': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'Costa Del Sol', 10502),
  'NORTH_BLOODSHORE': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'North Bloodshore', 10503),
  'HIDDEN_FALLS': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'Hidden Falls', 10504),
  'EAST_AGELYSS_RIVER': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'East Agelyss River', 10505),
  'RAINCATCHER_GULLY': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'Raincatcher Gully', 10506),
  'THE_JUGGERNAUT': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'The Juggernaut', 10507),
  'RED_MANTIS_FALLS': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'Red Mantis Falls', 10508),
  'RHOTANO_SEA_FORECASTLE': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'Rhotano Sea (Forecastle)', 10509),
  'RHOTANO_SEA_STERNCASTLE': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'Rhotano Sea (Sterncastle)', 10510),

  // Western La Noscea
  'SWIFTPERCH': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'Swiftperch', 10601),
  'SKULL_VALLEY': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'Skull Valley', 10602),
  'HALFSTONE': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'Halfstone', 10603),
  'NORTH_UMBRAL_ISLES': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'Isles of Umbra Northshore', 10604),
  'SOUTH_UMBRAL_ISLES': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'Isles of Umbra Southshore', 10605),
  'THE_BREWERS_BEACON': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'The Brewer\'s Beacon', 10606),
  'THE_SHIP_GRAVEYARD': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'The Ship Graveyard', 10607),
  'SAPSA_SPAWNING_GROUNDS': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'Sapsa Spawning Grounds', 10608),
  'REAVER_HIDE': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'Reaver Hide', 10609),

  // Upper La Noscea
  'OAKWOOD': new ff.model.Location(
      ff.model.AreaEnum.UPPER_LA_NOSCEA, 'Oakwood', 10701),
  'FOOL_FALLS': new ff.model.Location(
      ff.model.AreaEnum.UPPER_LA_NOSCEA, 'Fool Falls', 10702),
  'NORTH_BRONZE_LAKE': new ff.model.Location(
      ff.model.AreaEnum.UPPER_LA_NOSCEA, 'North Bronze Lake', 10703),
  'BRONZE_LAKE_SHALLOWS': new ff.model.Location(
      ff.model.AreaEnum.UPPER_LA_NOSCEA, 'Bronze Lake Shallows', 10704),

  // Outer La Noscea
  'THE_LONG_CLIMB': new ff.model.Location(
      ff.model.AreaEnum.OUTER_LA_NOSCEA, 'The Long Climb', 10801),

  // Mist
  'MIST': new ff.model.Location(
      ff.model.AreaEnum.MIST, 'Mist', 10901),

  // New Gridania
  'JADEITE_FLOOD': new ff.model.Location(
      ff.model.AreaEnum.NEW_GRIDANIA, 'Jadeite Flood', 20101),
  'LOWER_BLACK_TEA_BROOK': new ff.model.Location(
      ff.model.AreaEnum.NEW_GRIDANIA, 'Lower Black Tea Brook', 20102),

  // Old Gridania
  'WHISPERING_GORGE': new ff.model.Location(
      ff.model.AreaEnum.OLD_GRIDANIA, 'Whispering Gorge', 20201),
  'UPPER_BLACK_TEA_BROOK': new ff.model.Location(
      ff.model.AreaEnum.OLD_GRIDANIA, 'Upper Black Tea Brook', 20202),

  // Central Shroud
  'THE_VEIN': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_SHROUD, 'The Vein', 20301),
  'THE_MIRROR': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_SHROUD, 'The Mirror', 20302),
  'EVERSCHADE': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_SHROUD, 'Everschade', 20303),
  'HOPESEED_POND': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_SHROUD, 'Hopeseed Pond', 20304),
  'HAUKKE_MANOR': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_SHROUD, 'Haukke Manor', 20305),

  // East Shroud
  'SWEETBLOOM_PIER': new ff.model.Location(
      ff.model.AreaEnum.EAST_SHROUD, 'Sweetbloom Pier', 20401),
  'VERDANT_DROP': new ff.model.Location(
      ff.model.AreaEnum.EAST_SHROUD, 'Verdant Drop', 20402),
  'SPRINGGRIPPLE_BROOK': new ff.model.Location(
      ff.model.AreaEnum.EAST_SHROUD, 'Springgripple Brook', 20403),
  'SYLPHLANDS': new ff.model.Location(
      ff.model.AreaEnum.EAST_SHROUD, 'Sylphlands', 20404),
  'SANCTUM_OF_THE_TWELVE': new ff.model.Location(
      ff.model.AreaEnum.EAST_SHROUD, 'Sanctum Of The Twelve', 20405),

  // South Shroud
  'UPPER_HATHOEVA_RIVER': new ff.model.Location(
      ff.model.AreaEnum.SOUTH_SHROUD, 'Upper Hathoeva River', 20501),
  'MIDDLE_HATHOEVA_RIVER': new ff.model.Location(
      ff.model.AreaEnum.SOUTH_SHROUD, 'Middle Hathoeva River', 20502),
  'LOWER_HATHOEVA_RIVER': new ff.model.Location(
      ff.model.AreaEnum.SOUTH_SHROUD, 'Lower Hathoeva River', 20503),
  'EAST_HATHOEVA_RIVER': new ff.model.Location(
      ff.model.AreaEnum.SOUTH_SHROUD, 'East Hathoeva River', 20504),
  'GOBLINBLOOD': new ff.model.Location(
      ff.model.AreaEnum.SOUTH_SHROUD, 'Goblinblood', 20505),
  'ROOTSLAKE': new ff.model.Location(
      ff.model.AreaEnum.SOUTH_SHROUD, 'Rootslake', 20506),
  'URTHS_GIFT': new ff.model.Location(
      ff.model.AreaEnum.SOUTH_SHROUD, 'Urth\'s Gift', 20507),

  // North Shroud
  'MURMUR_RILLS': new ff.model.Location(
      ff.model.AreaEnum.NORTH_SHROUD, 'Murmur Rills', 20601),
  'FALLGOURD_FLOAT': new ff.model.Location(
      ff.model.AreaEnum.NORTH_SHROUD, 'Fallgourd Float', 20602),
  'PROUD_CREEK': new ff.model.Location(
      ff.model.AreaEnum.NORTH_SHROUD, 'Proud Creek', 20603),
  'LAKE_TAHTOTL': new ff.model.Location(
      ff.model.AreaEnum.NORTH_SHROUD, 'Lake Tahtotl', 20604),

  // Lavender Beds
  'LAVENDER_BEDS': new ff.model.Location(
      ff.model.AreaEnum.LAVENDER_BEDS, 'Lavender Beds', 20701),

  // Western Thanalan
  'THE_SILVER_BAZAAR': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'The Silver Bazaar', 30101),
  'VESPER_BAY': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'Vesper Bay', 30102),
  'CRESCENT_COVE': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'Crescent Cove', 30103),
  'NOPHICAS_WELLS': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'Nophica\'s Wells', 30104),
  'THE_FOOTFALLS': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'The Footfalls', 30105),
  'CAPE_WESTWIND': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'Cape Westwind', 30106),
  'PARATAS_PEACE': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'Parata\'s Peace', 30107),
  'MOONDRIP': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'Moondrip', 30108),

  // Central Thanalan
  'UPPER_SOOT_CREEK': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_THANALAN, 'Upper Soot Creek', 30201),
  'LOWER_SOOT_CREEK': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_THANALAN, 'Lower Soot Creek', 30202),
  'THE_UNHOLY_HEIR': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_THANALAN, 'The Unholy Heir', 30203),
  'THE_CLUTCH': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_THANALAN, 'The Clutch', 30204),

  // Eastern Thanalan
  'NORTH_DRYBONE': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_THANALAN, 'North Drybone', 30301),
  'SOUTH_DRYBONE': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_THANALAN, 'South Drybone', 30302),
  'YUGRAM_RIVER': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_THANALAN, 'Yugr\'am River', 30303),
  'THE_BURNING_WALL': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_THANALAN, 'The Burning Wall', 30304),

  // Southern Thanalan
  'BURNT_LIZARD_CREEK': new ff.model.Location(
      ff.model.AreaEnum.SOUTHERN_THANALAN, 'Burnt Lizard Creek', 30401),
  'ZAHARAK': new ff.model.Location(
      ff.model.AreaEnum.SOUTHERN_THANALAN, 'Zahar\'ak', 30402),
  'FORGOTTEN_SPRINGS': new ff.model.Location(
      ff.model.AreaEnum.SOUTHERN_THANALAN, 'Forgotten Springs', 30403),
  'SAGOLII_DESERT': new ff.model.Location(
      ff.model.AreaEnum.SOUTHERN_THANALAN, 'Sagolii Desert', 30404),
  'SAGOLII_DUNES': new ff.model.Location(
      ff.model.AreaEnum.SOUTHERN_THANALAN, 'Sagolii Dunes', 30405),

  // Northern Thanalan
  'CERULEUM_FIELD': new ff.model.Location(
      ff.model.AreaEnum.NORTHERN_THANALAN, 'Ceruleum Field', 30501),
  'BLUEFOG': new ff.model.Location(
      ff.model.AreaEnum.NORTHERN_THANALAN, 'Bluefog', 30502),

  // The Goblet
  'THE_GOBLET': new ff.model.Location(
      ff.model.AreaEnum.THE_GOBLET, 'The Goblet', 30601),

  // Coerthas Central Highlands
  'COERTHAS_RIVER': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'Coerthas River', 40101),
  'WITCHDROP': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'Witchdrop', 40102),
  'THE_NAIL': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'The Nail', 40103),
  'THE_WEEPING_SAINT': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'The Weeping Saint', 40104),
  'DRAGONHEAD_LATRINES': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'Dragonhead Latrines', 40105),
  'DANIFFEN_PASS': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'Daniffen Pass', 40106),
  'EXPLORATORY_ICE_HOLE': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'Exploratory Ice Hole', 40107),
  'SNOWCLOAK': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'Snowcloak', 40108),
  'SEA_OF_CLOUDS': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'Sea Of Clouds', 40109),

  // Mor Dhona
  'NORTH_SILVERTEAR': new ff.model.Location(
      ff.model.AreaEnum.MOR_DHONA, 'North Silvertear', 50101),
  'RATHEFROST': new ff.model.Location(
      ff.model.AreaEnum.MOR_DHONA, 'Rathefrost', 50102),
  'THE_TANGLE': new ff.model.Location(
      ff.model.AreaEnum.MOR_DHONA, 'The Tangle', 50103),
  'THE_DEEP_TANGLE': new ff.model.Location(
      ff.model.AreaEnum.MOR_DHONA, 'The Deep Tangle', 50104),
  'SINGING_SHARDS': new ff.model.Location(
      ff.model.AreaEnum.MOR_DHONA, 'Singing Shards', 50105),
  'THE_NORTH_SHARDS': new ff.model.Location(
      ff.model.AreaEnum.MOR_DHONA, 'The North Shards', 50106)
};
