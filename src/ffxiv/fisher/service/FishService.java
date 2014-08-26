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

import ffxiv.fisher.model.Fish;

/**
 * Service for interacting with fish data.
 */
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
	
	/**
	 * Stores a new fish.  For admin use only.
	 */
	public Fish storeNewFish(Fish fish) {
		// Validate fish.
		checkArgument(
				fish.getKey() == null || !fish.getKey().isEmpty(), "A key is already set.");
		checkArgument(fish.getName() != null, "Name must not be null");
		checkArgument(fish.getWeatherSet() != null, "Weather set must not be null");
		
		// Store the fish.
		ObjectDatastore datastore = datastoreProvider.get();
		datastore.store().instance(fish).now();
		Key key = datastore.associatedKey(fish);
		fish.setKey(KeyFactory.keyToString(key));
		
		return fish;
	}
}
