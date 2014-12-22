package ffxiv.fisher.model;

public enum Weather {
	AURORA(0),
	BLIZZARDS(1),
	CLEAR(2),
	DARKNESS(3),
	DUST_STORMS(4),
	ERUPTIONS(5),
	FAIR(6),
	FOG(7),
	GALES(8),
	GLOOM(9),
	HEAT_WAVE(10),
	HOPELESSNESS(11),
	HOT_SPELLS(12),
	LOUR(13),
	OVERCAST(14),
	RAIN(15),
	SANDSTORMS(16),
	SHOWERS(17),
	SNOW(18),
	STORM_CLOUDS(19),
	THUNDER(20),
	THUNDERSTORMS(21),
	TORRENTIAL(22),
	WIND(23);
	
	
	
	private final int clientIdentifier;
	
	private Weather(int clientIdentifier) {
		this.clientIdentifier = clientIdentifier;
	}
	
	public int getClientIdentifier() {
		return clientIdentifier;
	}
}
