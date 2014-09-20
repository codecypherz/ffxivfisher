package ffxiv.fisher.model;

/**
 * The type of fishing tackle.
 */
public enum FishingTackleType {
		
	BAIT(true),
	LURE(false);
	
	private final boolean consumedOnUse;
	
	private FishingTackleType(boolean consumedOnUse) {
		this.consumedOnUse = consumedOnUse;
	}
	
	public boolean isConsumedOnUse() {
		return consumedOnUse;
	}
}
