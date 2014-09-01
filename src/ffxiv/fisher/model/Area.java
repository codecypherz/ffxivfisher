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
	MIST(Region.LA_NOSCEA)
	
	// The Black Shroud
	// TODO Complete.
	;

	private final Region region;

	private Area(Region region) {
		this.region = region;
	}

	public Region getRegion() {
		return region;
	}
}
