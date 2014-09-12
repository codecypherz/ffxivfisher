package ffxiv.fisher.service;

import static com.google.common.base.Preconditions.checkArgument;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.Nullable;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.code.twig.ObjectDatastore;
import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.Singleton;

import ffxiv.fisher.model.Fish;

/**
 * Service for interacting with fish data.
 */
@Singleton
public class FishService {

	private final Provider<ObjectDatastore> datastoreProvider;
	
	@Inject
	public FishService(Provider<ObjectDatastore> datastoreProvider) {
		this.datastoreProvider = datastoreProvider;
	}
	
	/**
	 * Gets the fish for the given key.
	 */
	@Nullable
	public Fish get(Key key) {
		ObjectDatastore datastore = datastoreProvider.get();
		Fish fish = datastore.load(key);
		if (fish != null) {
			fish.setKey(KeyFactory.keyToString(key));			
		}
		return fish;
	}
	
	/**
	 * Gets all fish.
	 */
	public List<Fish> getAll() {
		ObjectDatastore datastore = datastoreProvider.get();
		Iterator<Fish> iterator = datastore
				.find()
				.type(Fish.class)
				.now();
		
		List<Fish> fishList = new ArrayList<>();
		while (iterator.hasNext()) {
			Fish fish = iterator.next();
			Key key = datastore.associatedKey(fish);
			fish.setKey(KeyFactory.keyToString(key));
			fishList.add(fish);
		}
		return fishList;
	}
	
	public Fish get(String key) {
		ObjectDatastore datastore = datastoreProvider.get();
		Fish fish = datastore.load(KeyFactory.stringToKey(key));
		fish.setKey(key);
		return fish;
	}
	
	public Fish update(Fish fish) {
		validate(fish, false);
		
		// Load the fish.
		ObjectDatastore datastore = datastoreProvider.get();
		Fish loadedFish = datastore.load(KeyFactory.stringToKey(fish.getKey()));
		loadedFish.setKey(fish.getKey());
		
		// Update the fish.
		loadedFish.setFromFish(fish);
		datastore.update(loadedFish);
		
		return loadedFish;
	}
	
	/**
	 * Stores a new fish.  For admin use only.
	 */
	public Fish create(Fish fish) {
		validate(fish, true);
		
		// Store the fish.
		ObjectDatastore datastore = datastoreProvider.get();
		datastore.store().instance(fish).now();
		Key key = datastore.associatedKey(fish);
		fish.setKey(KeyFactory.keyToString(key));
		
		return fish;
	}
	
	private void validate(Fish fish, boolean create) throws IllegalArgumentException {
		if (create) {
			checkArgument(fish.getKey() == null || fish.getKey().isEmpty(),
					"A key is already set.");
		} else {
			checkArgument(fish.getKey() != null && !fish.getKey().isEmpty(),
					"A key must be specified.");
		}
		
		checkArgument(fish.getName() != null && !fish.getName().isEmpty(),
				"Name must not be null");
		checkArgument(fish.getWeatherSet() != null, "Weather set must not be null");
		checkArgument(fish.getStartHour() >= 0 && fish.getStartHour() <= 24,
				"Start hour must be between 0 and 24 inclusive.");
		checkArgument(fish.getEndHour() >= 0 && fish.getEndHour() <= 24,
				"End hour must be between 0 and 24 inclusive.");
	}
}
