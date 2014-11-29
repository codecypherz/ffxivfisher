package ffxiv.fisher.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.google.code.twig.annotation.Store;

public class Fish {
	
	// This is just here so GSON can include this when sent to the client.
	@Store(false) private String key;
	
	private String name;
	private Weather previousWeatherRequired;
	private Set<Weather> weatherSet;
	private int startHour; // inclusive
	private int endHour; // exclusive
	private Location location;
	private List<CatchPathPart> bestCatchPath;
	
	public Fish() {
		this(
			"",  // key
			"Not Set", // name
			null, // previous weather required
			new HashSet<Weather>(),
			-1,  // start hour
			-1,  // end hour
			null, // location
			new ArrayList<CatchPathPart>());
	}
	
	public Fish(
			String key,
			String name,
			Weather previousWeatherRequired,
			Set<Weather> weatherSet,
			int startHour,
			int endHour,
			Location location,
			List<CatchPathPart> bestCatchPath) {
		this.key = key;
		this.name = name;
		this.previousWeatherRequired = previousWeatherRequired;
		this.weatherSet = weatherSet;
		this.startHour = startHour;
		this.endHour = endHour;
		this.location = location;
		this.bestCatchPath = bestCatchPath;
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
	public Weather getPreviousWeatherRequired() {
		return previousWeatherRequired;
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
	public List<CatchPathPart> getBestCatchPath() {
		return bestCatchPath;
	}

	public void setFromFish(Fish other) {
		name = other.name;
		previousWeatherRequired = other.previousWeatherRequired;
		weatherSet = other.weatherSet;
		startHour = other.startHour;
		endHour = other.endHour;
		location = other.location;
		bestCatchPath = other.bestCatchPath;
	}
}
