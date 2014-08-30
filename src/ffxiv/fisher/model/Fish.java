package ffxiv.fisher.model;

import java.util.HashSet;
import java.util.Set;

import com.google.code.twig.annotation.Store;

public class Fish {

	// This is just here so GSON can include this when sent to the client.
	@Store(false) private String key;
	
	private String name;
	private Set<Weather> weatherSet;
	private int startHour; // inclusive
	private int endHour; // inclusive
	
	public Fish() {
		this(
			"",
			"Not Set",
			new HashSet<Weather>(),
			-1,
			-1);
	}
	
	private Fish(
			String key,
			String name,
			Set<Weather> weatherSet,
			int startHour,
			int endHour) {
		this.key = key;
		this.name = name;
		this.weatherSet = weatherSet;
		this.startHour = startHour;
		this.endHour = endHour;
	}
	
	public String getKey() {
		return key;
	}
	// Mutable for convenience.
	public void setKey(String key) {
		this.key = key;
	}
	
	public String getName() {
		return name;
	}
	public Set<Weather> getWeatherSet() {
		return weatherSet;
	}
	public int getStartHour() {
		return startHour;
	}
	public int getEndHour() {
		return endHour;
	}
}
