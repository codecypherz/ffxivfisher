package ffxiv.fisher.model;

import com.google.code.twig.annotation.Store;

public class Fish {

	// This is just here so GSON can include this when sent to the client.
	@Store(false) private String key;
	
	private String name;
	
	public Fish() {
		this("", "");
	}
	
	// TODO Remove this once the DB exists?
	public Fish(String key, String name) {
		this.key = key;
		this.name = name;
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
	public void setName(String name) {
		this.name = name;
	}
}
