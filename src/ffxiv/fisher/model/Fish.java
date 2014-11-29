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
	private Set<Weather> previousWeatherSet;
	private Set<Weather> weatherSet;
	private int startHour; // inclusive
	private int endHour; // exclusive
	private Location location;
	private List<CatchPathPart> bestCatchPath;
	private String predator;
	private int predatorCount;
	
	public Fish() {
		this(
			"",  // key
			"Not Set", // name
			new HashSet<Weather>(), // previous weather required
			new HashSet<Weather>(), // current weather required
			-1,  // start hour
			-1,  // end hour
			null, // location
			new ArrayList<CatchPathPart>(),
			null, // predator
			0); // predator count
	}
	
	public Fish(
			String key,
			String name,
			Set<Weather> previousWeatherSet,
			Set<Weather> weatherSet,
			int startHour,
			int endHour,
			Location location,
			List<CatchPathPart> bestCatchPath,
			String predator,
			int predatorCount) {
		this.key = key;
		this.name = name;
		this.previousWeatherSet = previousWeatherSet;
		this.weatherSet = weatherSet;
		this.startHour = startHour;
		this.endHour = endHour;
		this.location = location;
		this.bestCatchPath = bestCatchPath;
		this.predator = predator;
		this.predatorCount = predatorCount;
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
	public Set<Weather> getPreviousWeatherSet() {
		return previousWeatherSet;
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
	public String getPredator() {
		return predator;
	}
	public int getPredatorCount() {
		return predatorCount;
	}

	public void setFromFish(Fish other) {
		name = other.name;
		previousWeatherSet = other.previousWeatherSet;
		weatherSet = other.weatherSet;
		startHour = other.startHour;
		endHour = other.endHour;
		location = other.location;
		bestCatchPath = other.bestCatchPath;
		predator = other.predator;
		predatorCount = other.predatorCount;
	}
}
