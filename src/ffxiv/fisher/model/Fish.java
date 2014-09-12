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
	private int endHour; // exclusive
	private Location location;
	
	public Fish() {
		this(
			"",  // key
			"Not Set", // name
			new HashSet<Weather>(),
			-1,  // start hour
			-1,  // end hour
			null // location
			);
	}
	
	public Fish(
			String key,
			String name,
			Set<Weather> weatherSet,
			int startHour,
			int endHour,
			Location location) {
		this.key = key;
		this.name = name;
		this.weatherSet = weatherSet;
		this.startHour = startHour;
		this.endHour = endHour;
		this.location = location;
	}
	
	public String getKey() {
		return key;
	}
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
	public Location getLocation() {
		return location;
	}

	public void setFromFish(Fish other) {
		name = other.name;
		weatherSet = other.weatherSet;
		startHour = other.startHour;
		endHour = other.endHour;
		location = other.location;
	}
}
