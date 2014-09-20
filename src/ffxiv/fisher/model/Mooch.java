package ffxiv.fisher.model;

public class Mooch implements CatchPathPart {
	
	private final String fishName;
	
	public Mooch() {
		this("not set");
	}
	
	public Mooch(String fishName) {
		this.fishName = fishName;
	}
	
	public String getFishName() {
		return fishName;
	}
}
