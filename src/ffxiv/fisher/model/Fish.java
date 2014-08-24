package ffxiv.fisher.model;

import java.util.HashSet;
import java.util.Set;

import com.google.code.twig.annotation.Store;

public class Fish {

	// This is just here so GSON can include this when sent to the client.
	@Store(false) private String key;
	
	private String name;
	private Set<Weather> weatherSet;
	
	public Fish() {
		this(
			"",
			"",
			new HashSet<Weather>());
	}
	
	private Fish(
			String key,
			String name,
			Set<Weather> weatherSet) {
		this.key = key;
		this.name = name;
		this.weatherSet = weatherSet;
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
	
	public static class Builder {
		private String key;
		private String name;
		private Set<Weather> weatherSet;
		
		public Builder() {
		}
		
		public Builder(Fish fromFish) {
			this.key = fromFish.getKey();
			this.name = fromFish.getName();
			this.weatherSet = new HashSet<>(fromFish.getWeatherSet());
		}
		
		public Builder setKey(String key) {
			this.key = key;
			return this;
		}
		public Builder setName(String name) {
			this.name = name;
			return this;
		}
		public Builder setWeatherSet(Set<Weather> weather) {
			this.weatherSet = weather;
			return this;
		}
		
		public Fish build() {
			return new Fish(key, name, weatherSet);
		}
	}
}
