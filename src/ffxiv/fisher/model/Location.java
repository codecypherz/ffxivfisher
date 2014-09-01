package ffxiv.fisher.model;

public enum Location {
	
	// ===== La Noscea =====
	
	// Limsa Lominsa Upper Decks
	LIMSA_LOMINSA_UPPER_DECKS(Area.LIMSA_LOMINSA_UPPER_DECKS),
	
	// Limsa Lominsa Lower Decks
	LIMSA_LOMINSA_LOWER_DECKS(Area.LIMSA_LOMINSA_LOWER_DECKS),
	
	// Middle La Noscea
	ZEPHYR_DRIFT(Area.MIDDLE_LA_NOSCEA),
	ROGUE_RIVER(Area.MIDDLE_LA_NOSCEA),
	WEST_AGELYSS_RIVER(Area.MIDDLE_LA_NOSCEA),
	SUMMERFORD(Area.MIDDLE_LA_NOSCEA),
	NYM_RIVER(Area.MIDDLE_LA_NOSCEA),
	WOAD_WHISPER_CANYON(Area.MIDDLE_LA_NOSCEA)
	
	// Lower La Noscea
    // TODO Complete	
	;
	
	private final Area area;
	
	private Location(Area area) {
		this.area = area;
	}
	
	public Area getArea() {
		return area;
	}
}
