package ffxiv.fisher.model;

public enum Area {
	
	// La Noscea
	LIMSA_LOMINSA_UPPER_DECKS(0, Region.LA_NOSCEA),
	LIMSA_LOMINSA_LOWER_DECKS(1, Region.LA_NOSCEA),
	MIDDLE_LA_NOSCEA(2, Region.LA_NOSCEA),
	LOWER_LA_NOSCEA(3, Region.LA_NOSCEA),
	EASTERN_LA_NOSCEA(4, Region.LA_NOSCEA),
	WESTERN_LA_NOSCEA(5, Region.LA_NOSCEA),
	UPPER_LA_NOSCEA(6, Region.LA_NOSCEA),
	OUTER_LA_NOSCEA(7, Region.LA_NOSCEA),
	MIST(8, Region.LA_NOSCEA),
	
	// The Black Shroud
	NEW_GRIDANIA(9, Region.THE_BLACK_SHROUD),
	OLD_GRIDANIA(10, Region.THE_BLACK_SHROUD),
	CENTRAL_SHROUD(11, Region.THE_BLACK_SHROUD),
	EAST_SHROUD(12, Region.THE_BLACK_SHROUD),
	SOUTH_SHROUD(13, Region.THE_BLACK_SHROUD),
	NORTH_SHROUD(14, Region.THE_BLACK_SHROUD),
	LAVENDER_BEDS(15, Region.THE_BLACK_SHROUD),
	
	// Thanalan
	WESTERN_THANALAN(16, Region.THANALAN),
	CENTRAL_THANALAN(17, Region.THANALAN),
	EASTERN_THANALAN(18, Region.THANALAN),
	SOUTHERN_THANALAN(19, Region.THANALAN),
	NORTHERN_THANALAN(20, Region.THANALAN),
	THE_GOBLET(21, Region.THANALAN),
	
	// Coerthas
	COERTHAS_CENTRAL_HIGHLANDS(22, Region.COERTHAS),
	
	// Mor Dhona
	MOR_DHONA(23, Region.MOR_DHONA);
	
	
	
	private final int clientIdentifier;
	private final Region region;

	private Area(int clientIdentifier, Region region) {
		this.clientIdentifier = clientIdentifier;
		this.region = region;
	}

	public Region getRegion() {
		return region;
	}
	
	public int getClientIdentifier() {
		return clientIdentifier;
	}
}
