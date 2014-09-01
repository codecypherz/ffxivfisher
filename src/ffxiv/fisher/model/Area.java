package ffxiv.fisher.model;

public enum Area {
	
	// La Noscea
	LIMSA_LOMINSA_UPPER_DECKS(Region.LA_NOSCEA),
	LIMSA_LOMINSA_LOWER_DECKS(Region.LA_NOSCEA),
	MIDDLE_LA_NOSCEA(Region.LA_NOSCEA),
	LOWER_LA_NOSCEA(Region.LA_NOSCEA),
	EASTERN_LA_NOSCEA(Region.LA_NOSCEA),
	WESTERN_LA_NOSCEA(Region.LA_NOSCEA),
	UPPER_LA_NOSCEA(Region.LA_NOSCEA),
	OUTER_LA_NOSCEA(Region.LA_NOSCEA),
	MIST(Region.LA_NOSCEA),
	
	// The Black Shroud
	NEW_GRIDANIA(Region.THE_BLACK_SHROUD),
	OLD_GRIDANIA(Region.THE_BLACK_SHROUD),
	CENTRAL_SHROUD(Region.THE_BLACK_SHROUD),
	EAST_SHROUD(Region.THE_BLACK_SHROUD),
	SOUTH_SHROUD(Region.THE_BLACK_SHROUD),
	NORTH_SHROUD(Region.THE_BLACK_SHROUD),
	LAVENDER_BEDS(Region.THE_BLACK_SHROUD),
	
	// Thanalan
	WESTERN_THANALAN(Region.THANALAN),
	CENTRAL_THANALAN(Region.THANALAN),
	EASTERN_THANALAN(Region.THANALAN),
	SOUTHERN_THANALAN(Region.THANALAN),
	NORTHERN_THANALAN(Region.THANALAN),
	THE_GOBLET(Region.THANALAN),
	
	// Coerthas
	COERTHAS_CENTRAL_HIGHLANDS(Region.COERTHAS),
	
	// Mor Dhona
	MOR_DHONA(Region.MOR_DHONA);

	private final Region region;

	private Area(Region region) {
		this.region = region;
	}

	public Region getRegion() {
		return region;
	}
}
