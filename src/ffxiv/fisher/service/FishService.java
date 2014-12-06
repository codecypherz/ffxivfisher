package ffxiv.fisher.service;

import static com.google.common.base.Preconditions.checkArgument;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.logging.Logger;

import javax.annotation.Nullable;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.code.twig.ObjectDatastore;
import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.Singleton;

import ffxiv.fisher.Annotations.DevelopmentEnvironment;
import ffxiv.fisher.model.Fish;
import ffxiv.fisher.model.FishSerializer;

/**
 * Service for interacting with fish data.
 */
@Singleton
public class FishService {

	/**
	 * Allows other layers to invalidate their caches when fish change.
	 */
	public static interface InvalidationCallback {
		void invalidate();
	}
	
	private static final Logger log = Logger.getLogger(FishService.class.getName());
	
	private static final String MEMCACHE_FISHES_KEY = "fishes";
	
	// Level 1 cache: store the fish in memory.
	// Fastest when available (nearly instant).
	private final AtomicReference<List<Fish>> cachedFishRef;
	
	// Level 2 cache: memcache.  Helps when pushing a new server.
	// Second fastest when available (~20-40ms).
	private final MemcacheService memcacheService;
	
	// The source of truth for fish.  Sloooooooow (on the order of seconds).
	private final Provider<ObjectDatastore> datastoreProvider;
	
	private final FishSerializer fishSerializer;
	private final List<InvalidationCallback> invalidationCallbacks;
	private final boolean isDevelopmentEnvironment;
	
	@Inject
	public FishService(
			Provider<ObjectDatastore> datastoreProvider,
			MemcacheService memcacheService,
			FishSerializer fishSerializer,
			@DevelopmentEnvironment boolean isDevelopmentEnvironment) {
		this.datastoreProvider = datastoreProvider;
		this.memcacheService = memcacheService;
		this.fishSerializer = fishSerializer;
		this.isDevelopmentEnvironment = isDevelopmentEnvironment;

		cachedFishRef = new AtomicReference<>();
		invalidationCallbacks = new ArrayList<>();
	}
	
	public void registerInvalidationCallback(InvalidationCallback callback) {
		invalidationCallbacks.add(callback);
	}
	
	/**
	 * Gets the fish for the given key.
	 */
	@Nullable
	public Fish get(Key key) {
		// TODO Read from Level 1 and 2 caches first.
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
		// Read from Level 1 cache first.  Should happen frequently.
		List<Fish> cachedFish = cachedFishRef.get();
		if (cachedFish != null) {
			log.info("Returning fish from memory.");
			return cachedFish;
		}
		
		// Read from Level 2 cache next.  Should only happen after a server push.
		String cachedFishJson = (String) memcacheService.get(MEMCACHE_FISHES_KEY);
		if (cachedFishJson != null) {
			cachedFish = fishSerializer.deserializeAll(cachedFishJson);
			// Update Level 1 cache from memcache.
			cachedFishRef.compareAndSet(null, cachedFish);
			log.info("Returning fish from memcache.");
			return cachedFish;
		}
		
		// Only read from the database if we must.  Shouldn't really happen unless
		// data was written and caches were invalidated.
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
		
		// Update both Level 1 and Level 2 caches.
		cachedFishRef.compareAndSet(null, fishList);
		memcacheService.put(MEMCACHE_FISHES_KEY, fishSerializer.serialize(fishList));
		
		log.info("Returning fish from the database.");
		return fishList;
	}
	
	public Fish get(String key) {
		// TODO(jdeyerle): Utilize cached fish.
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
		
		// TODO Be smarter and just update the cache instead.  This operation
		// is very infrequent, though.
		invalidateCaches();
		
		return loadedFish;
	}
	
	/**
	 * Stores a new fish.  For admin use only.
	 */
	public Fish create(Fish fish) {
		return create(fish, true);
	}
	
	/**
	 * Stores a new fish.  For admin use only.
	 */
	public Fish createWithoutValidation(Fish fish) {
		return create(fish, false);
	}
	
	/**
	 * Creates a fish but with the option of skipping validation.  Skipping
	 * validation is only used in the admin path.
	 */
	private Fish create(Fish fish, boolean withValidation) {
		if (withValidation) {
			validate(fish, true);
		}
		
		// Store the fish.
		ObjectDatastore datastore = datastoreProvider.get();
		datastore.store().instance(fish).now();
		Key key = datastore.associatedKey(fish);
		fish.setKey(KeyFactory.keyToString(key));
		
		// TODO Be smarter and just update the cache instead.  This operation
		// is very infrequent, though.
		invalidateCaches();
		
		return fish;
	}
	
	/**
	 * Validates the fish in question.  The path is shared between update and create.
	 * An {@link IllegalArgumentException} is thrown if anything is invalid.
	 */
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
	
	/**
	 * Deletes all the fish in the database.  This is only called from the development
	 * environment when refreshing the database.  This should NEVER be called in
	 * production.
	 */
	public void deleteAll() {
		// Safeguard against deleting production data.
		if (!isDevelopmentEnvironment) {
			log.severe("Attempted to delete all fish in production.");
			return;
		}
		
		ObjectDatastore datastore = datastoreProvider.get();
		datastore.deleteAll(Fish.class);

		// Invalidate caches on write.
		invalidateCaches();
	}
	
	/**
	 * This is a hack.  It is used to try and keep memcache data around by
	 * assuming that anything placed in memcache has a TTL.  By reading memcache
	 * we are assuming it's refreshed and kept alive.
	 */
	public void keepMemcacheAlive() {
		log.info("Keeping memcache alive");
		Object allFishJson = memcacheService.get(MEMCACHE_FISHES_KEY);
		if (allFishJson != null) {
			log.info("Memcache is still fresh");
		} else {
			log.info("Memcache has no fish");
		}
	}
	
	/**
	 * Invalidates all caches for fish.  Used whenever a large mutation happens.
	 */
	private void invalidateCaches() {
		log.info("Invalidating all fish caches.");
		
		cachedFishRef.set(null);
		memcacheService.delete(MEMCACHE_FISHES_KEY);
		
		// Notify all registered callbacks of invalidation.
		for (InvalidationCallback callback : invalidationCallbacks) {
			callback.invalidate();
		}
	}
}
