package ffxiv.fisher.model;

public class StraightCatch implements CatchPathPart {
	
	private final FishingTackle fishingTackle;
	
	public StraightCatch() {
		this(null);
	}
	
	public StraightCatch(FishingTackle fishingTackle) {
		this.fishingTackle = fishingTackle;
	}
	
	public FishingTackle getFishingTackle() {
		return fishingTackle;
	}
}
