package ffxiv.fisher.model;

import static ffxiv.fisher.model.FishingTackleType.BAIT;
import static ffxiv.fisher.model.FishingTackleType.LURE;

/**
 * The item used to catch a fish.
 */
public enum FishingTackle {
	
	MOTH_PUPA(BAIT, 1),
	LUGWORM(BAIT, 1),
	CRAYFISH_BALL(BAIT, 5),
	PILL_BUG(BAIT, 5),
	GOBY_BALL(BAIT, 10),
	BLOODWORM(BAIT, 10),
	MIDGE_BASKET(BAIT, 15),
	RAT_TAIL(BAIT, 15),
	CRAB_BALL(BAIT, 20),
	CROW_FLY(LURE, 20),
	
	BUTTERWORM(BAIT, 20),
	FLOATING_MINNOW(LURE, 22),
	BRASS_SPOON_LURE(LURE, 23),
	SHRIMP_CAGE_FEEDER(BAIT, 25),
	BASS_BALL(BAIT, 25),
	CHOCOBO_FLY(LURE, 27),
	SPOON_WORM(BAIT, 30),
	SYRPHID_BASKET(BAIT, 30),
	SILVER_SPOON_LURE(LURE, 32),
	STEEL_JIG(LURE, 32),
	
	SINKING_MINNOW(LURE, 34),
	SAND_LEECH(BAIT, 35),
	HONEY_WORM(BAIT, 35),
	HERRING_BALL(BAIT, 35),
	WILDFOWL_FLY(LURE, 36),
	HEAVY_STEEL_JIG(LURE, 37),
	SPINNER(LURE, 39),
	KRILL_CAGE_FEEDER(BAIT, 40),
	SAND_GECKO(BAIT, 40),
	STEM_BORER(BAIT, 40),
	
	MYTHRIL_SPOON_LURE(LURE, 41),
	SNURBLE_FLY(LURE, 43),
	TOPWATER_FROG(LURE, 44),
	GLOWWORM(BAIT, 45),
	HOVERWORM(BAIT, 45),
	ROLLING_STONE(BAIT, 45),
	RAINBOW_SPOON_LURE(LURE, 46),
	SPINNERBAIT(LURE, 47),
	STREAMER(LURE, 48),
	YUMIZUNO(LURE, 48),
	
	CADDISFLY_LARVA(BAIT, 50),
	NORTHERN_KRILL(BAIT, 50),
	BALLOON_BUG(BAIT, 50);
	
	private final FishingTackleType type;
	private final int itemLevel;
	
	private FishingTackle(FishingTackleType type, int itemLevel) {
		this.type = type;
		this.itemLevel = itemLevel;
	}
	
	public FishingTackleType getType() {
		return type;
	}
	
	public int getItemLevel() {
		return itemLevel;
	}
}
