
goog.provide('ff.model.Location');

goog.require('ff.model.AreaEnum');
goog.provide('ff.model.LocationEnum');



/**
 * @param {!ff.model.Area} area
 * @param {string} name
 * @constructor
 */
ff.model.Location = function(area, name) {

  /** @private {!ff.model.Area} */
  this.area_ = area;

  /** @private {string} */
  this.name_ = name;
};


/** @return {!ff.model.Area} */
ff.model.Location.prototype.getArea = function() {
  return this.area_;
};


/** @return {string} */
ff.model.Location.prototype.getName = function() {
  return this.name_;
};


/**
 * @enum {!ff.model.Location}
 */
ff.model.LocationEnum = {

  // Limsa Lominsa Upper Decks
  'LIMSA_LOMINSA_UPPER_DECKS': new ff.model.Location(
      ff.model.AreaEnum.LIMSA_LOMINSA_UPPER_DECKS, 'Limsa Lominsa Upper Decks'),

  // Limsa Lominsa Lower Decks
  'LIMSA_LOMINSA_LOWER_DECKS': new ff.model.Location(
      ff.model.AreaEnum.LIMSA_LOMINSA_LOWER_DECKS, 'Limsa Lominsa Lower Decks'),

  // Middle La Noscea
  'ZEPHYR_DRIFT': new ff.model.Location(
      ff.model.AreaEnum.MIDDLE_LA_NOSCEA, 'Zephyr Drift'),
  'ROGUE_RIVER': new ff.model.Location(
      ff.model.AreaEnum.MIDDLE_LA_NOSCEA, 'Rogue River'),
  'WEST_AGELYSS_RIVER': new ff.model.Location(
      ff.model.AreaEnum.MIDDLE_LA_NOSCEA, 'West Agelyss River'),
  'SUMMERFORD': new ff.model.Location(
      ff.model.AreaEnum.MIDDLE_LA_NOSCEA, 'Summerford'),
  'NYM_RIVER': new ff.model.Location(
      ff.model.AreaEnum.MIDDLE_LA_NOSCEA, 'Nym River'),
  'WOAD_WHISPER_CANYON': new ff.model.Location(
      ff.model.AreaEnum.MIDDLE_LA_NOSCEA, 'Woad Whisper Canyon'),

  // Lower La Noscea
  'THE_MOURNING_WIDOW': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'The Mourning Widow'),
  'MORABY_BAY': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'Moraby Bay'),
  'CEDARWOOD': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'Cedarwood'),
  'MORABY_DRYDOCKS': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'Moraby Drydocks'),
  'OSCHONS_TORCH': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'Oschon\'s Torch'),
  'THE_SALT_STRAND': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'The Salt Strand'),
  'CANDLEKEEP_QUAY': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'Candlekeep Quay'),
  'EMPTY_HEART': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'Empty Heart'),
  'BLIND_IRON_MINES': new ff.model.Location(
      ff.model.AreaEnum.LOWER_LA_NOSCEA, 'Blind Iron Mines'),

  // Eastern La Noscea
  'SOUTH_BLOODSHORE': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'South Bloodshore'),
  'COSTA_DEL_SOL': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'Costa Del Sol'),
  'NORTH_BLOODSHORE': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'North Bloodshore'),
  'HIDDEN_FALLS': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'Hidden Falls'),
  'EAST_AGELYSS_RIVER': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'East Agelyss River'),
  'RAINCATCHER_GULLY': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'Raincatcher Gully'),
  'THE_JUGGERNAUT': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'The Juggernaut'),
  'RED_MANTIS_FALLS': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'Red Mantis Falls'),
  'RHOTANO_SEA_FORECASTLE': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'Rhotano Sea (Forecastle)'),
  'RHOTANO_SEA_STERNCASTLE': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_LA_NOSCEA, 'Rhotano Sea (Sterncastle)'),

  // Western La Noscea
  'SWIFTPERCH': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'Swiftperch'),
  'SKULL_VALLEY': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'Skull Valley'),
  'HALFSTONE': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'Halfstone'),
  'NORTH_UMBRAL_ISLES': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'North Umbral Isles'),
  'SOUTH_UMBRAL_ISLES': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'South Umbral Isles'),
  'THE_BREWERS_BEACON': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'The Brewer\'s Beacon'),
  'THE_SHIP_GRAVEYARD': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'The Ship Graveyard'),
  'SAPSA_SPAWNING_GROUNDS': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'Sapsa Spawning Grounds'),
  'REAVER_HIDE': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_LA_NOSCEA, 'Reaver Hide'),

  // Upper La Noscea
  'OAKWOOD': new ff.model.Location(
      ff.model.AreaEnum.UPPER_LA_NOSCEA, 'Oakwood'),
  'FOOL_FALLS': new ff.model.Location(
      ff.model.AreaEnum.UPPER_LA_NOSCEA, 'Fool Falls'),
  'NORTH_BRONZE_LAKE': new ff.model.Location(
      ff.model.AreaEnum.UPPER_LA_NOSCEA, 'North Bronze Lake'),
  'BRONZE_LAKE_SHALLOWS': new ff.model.Location(
      ff.model.AreaEnum.UPPER_LA_NOSCEA, 'Bronze Lake Shallows'),

  // Outer La Noscea
  'THE_LONG_CLIMB': new ff.model.Location(
      ff.model.AreaEnum.OUTER_LA_NOSCEA, 'The Long Climb'),

  // Mist
  'MIST': new ff.model.Location(
      ff.model.AreaEnum.MIST, 'Mist'),

  // New Gridania
  'JADEITE_FLOOD': new ff.model.Location(
      ff.model.AreaEnum.NEW_GRIDANIA, 'Jadeite Flood'),
  'LOWER_BLACK_TEA_BROOK': new ff.model.Location(
      ff.model.AreaEnum.NEW_GRIDANIA, 'Lower Black Tea Brook'),

  // Old Gridania
  'WHISPERING_GORGE': new ff.model.Location(
      ff.model.AreaEnum.OLD_GRIDANIA, 'Whispering Gorge'),
  'UPPER_BLACK_TEA_BROOK': new ff.model.Location(
      ff.model.AreaEnum.OLD_GRIDANIA, 'Upper Black Tea Brook'),

  // Central Shroud
  'THE_VEIN': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_SHROUD, 'The Vein'),
  'THE_MIRROR': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_SHROUD, 'The Mirror'),
  'EVERSCHADE': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_SHROUD, 'Everschade'),
  'HOPESEED_POND': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_SHROUD, 'Hopeseed Pond'),
  'HAUKKE_MANOR': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_SHROUD, 'Haukke Manor'),

  // East Shroud
  'SWEETBLOOM_PIER': new ff.model.Location(
      ff.model.AreaEnum.EAST_SHROUD, 'Sweetbloom Pier'),
  'VERDANT_DROP': new ff.model.Location(
      ff.model.AreaEnum.EAST_SHROUD, 'Verdant Drop'),
  'SPRINGGRIPPLE_BROOK': new ff.model.Location(
      ff.model.AreaEnum.EAST_SHROUD, 'Springgripple Brook'),
  'SYLPHLANDS': new ff.model.Location(
      ff.model.AreaEnum.EAST_SHROUD, 'Sylphlands'),
  'SANCTUM_OF_THE_TWELVE': new ff.model.Location(
      ff.model.AreaEnum.EAST_SHROUD, 'Sanctum Of The Twelve'),

  // South Shroud
  'UPPER_HATHOEVA_RIVER': new ff.model.Location(
      ff.model.AreaEnum.SOUTH_SHROUD, 'Upper Hathoeva River'),
  'MIDDLE_HATHOEVA_RIVER': new ff.model.Location(
      ff.model.AreaEnum.SOUTH_SHROUD, 'Middle Hathoeva River'),
  'LOWER_HATHOEVA_RIVER': new ff.model.Location(
      ff.model.AreaEnum.SOUTH_SHROUD, 'Lower Hathoeva River'),
  'EAST_HATHOEVA_RIVER': new ff.model.Location(
      ff.model.AreaEnum.SOUTH_SHROUD, 'East Hathoeva River'),
  'GOBLINBLOOD': new ff.model.Location(
      ff.model.AreaEnum.SOUTH_SHROUD, 'Goblinblood'),
  'ROOTSLAKE': new ff.model.Location(
      ff.model.AreaEnum.SOUTH_SHROUD, 'Rootslake'),
  'URTHS_GIFT': new ff.model.Location(
      ff.model.AreaEnum.SOUTH_SHROUD, 'Urth\'s Gift'),

  // North Shroud
  'MURMUR_RILLS': new ff.model.Location(
      ff.model.AreaEnum.NORTH_SHROUD, 'Murmur Rills'),
  'FALLGOURD_FLOAT': new ff.model.Location(
      ff.model.AreaEnum.NORTH_SHROUD, 'Fallgourd Float'),
  'PROUD_CREEK': new ff.model.Location(
      ff.model.AreaEnum.NORTH_SHROUD, 'Proud Creek'),
  'LAKE_TAHTOTL': new ff.model.Location(
      ff.model.AreaEnum.NORTH_SHROUD, 'Lake Tahtotl'),

  // Lavender Beds
  'LAVENDER_BEDS': new ff.model.Location(
      ff.model.AreaEnum.LAVENDER_BEDS, 'Lavender Beds'),

  // Western Thanalan
  'THE_SILVER_BAZAAR': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'The Silver Bazaar'),
  'VESPER_BAY': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'Vesper Bay'),
  'CRESCENT_COVE': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'Crescent Cove'),
  'NOPHICAS_WELLS': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'Nophica\'s Wells'),
  'THE_FOOTFALLS': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'The Footfalls'),
  'CAPE_WESTWIND': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'Cape Westwind'),
  'PARATAS_PEACE': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'Parata\'s Peace'),
  'MOONDRIP': new ff.model.Location(
      ff.model.AreaEnum.WESTERN_THANALAN, 'Moondrip'),

  // Central Thanalan
  'UPPER_SOOT_CREEK': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_THANALAN, 'Upper Soot Creek'),
  'LOWER_SOOT_CREEK': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_THANALAN, 'Lower Soot Creek'),
  'THE_UNHOLY_HEIR': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_THANALAN, 'The Unholy Heir'),
  'THE_CLUTCH': new ff.model.Location(
      ff.model.AreaEnum.CENTRAL_THANALAN, 'The Clutch'),

  // Eastern Thanalan
  'NORTH_DRYBONE': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_THANALAN, 'North Drybone'),
  'SOUTH_DRYBONE': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_THANALAN, 'South Drybone'),
  'YUGRAM_RIVER': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_THANALAN, 'Yugr\'am River'),
  'THE_BURNING_WALL': new ff.model.Location(
      ff.model.AreaEnum.EASTERN_THANALAN, 'The Burning Wall'),

  // Southern Thanalan
  'BURNT_LIZARD_CREEK': new ff.model.Location(
      ff.model.AreaEnum.SOUTHERN_THANALAN, 'Burnt Lizard Creek'),
  'ZAHARAK': new ff.model.Location(
      ff.model.AreaEnum.SOUTHERN_THANALAN, 'Zahar\'ak'),
  'FORGOTTEN_SPRINGS': new ff.model.Location(
      ff.model.AreaEnum.SOUTHERN_THANALAN, 'Forgotten Springs'),
  'SAGOLII_DESERT': new ff.model.Location(
      ff.model.AreaEnum.SOUTHERN_THANALAN, 'Sagolii Desert'),
  'SAGOLII_DUNES': new ff.model.Location(
      ff.model.AreaEnum.SOUTHERN_THANALAN, 'Sagolii Dunes'),

  // Northern Thanalan
  'CERULEUM_FIELD': new ff.model.Location(
      ff.model.AreaEnum.NORTHERN_THANALAN, 'Ceruleum Field'),
  'BLUEFOG': new ff.model.Location(
      ff.model.AreaEnum.NORTHERN_THANALAN, 'Bluefog'),

  // The Goblet
  'THE_GOBLET': new ff.model.Location(
      ff.model.AreaEnum.THE_GOBLET, 'The Goblet'),

  // Coerthas Central Highlands
  'COERTHAS_RIVER': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'Coerthas River'),
  'WITCHDROP': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'Witchdrop'),
  'THE_NAIL': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'The Nail'),
  'THE_WEEPING_SAINT': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'The Weeping Saint'),
  'DRAGONHEAD_LATRINES': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'Dragonhead Latrines'),
  'DANIFFEN_PASS': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'Daniffen Pass'),
  'EXPLORATORY_ICE_HOLE': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'Exploratory Ice Hole'),
  'SNOWCLOAK': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'Snowcloak'),
  'SEA_OF_CLOUDS': new ff.model.Location(
      ff.model.AreaEnum.COERTHAS_CENTRAL_HIGHLANDS, 'Sea Of Clouds'),

  // Mor Dhona
  'NORTH_SILVERTEAR': new ff.model.Location(
      ff.model.AreaEnum.MOR_DHONA, 'North Silvertear'),
  'RATHEFROST': new ff.model.Location(
      ff.model.AreaEnum.MOR_DHONA, 'Rathefrost'),
  'THE_TANGLE': new ff.model.Location(
      ff.model.AreaEnum.MOR_DHONA, 'The Tangle'),
  'THE_DEEP_TANGLE': new ff.model.Location(
      ff.model.AreaEnum.MOR_DHONA, 'The Deep Tangle'),
  'SINGING_SHARDS': new ff.model.Location(
      ff.model.AreaEnum.MOR_DHONA, 'Singing Shards'),
  'THE_NORTH_SHARDS': new ff.model.Location(
      ff.model.AreaEnum.MOR_DHONA, 'The North Shards')
};
