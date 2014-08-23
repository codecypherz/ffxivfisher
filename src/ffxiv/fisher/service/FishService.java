package ffxiv.fisher.service;

import java.util.List;

import com.google.code.twig.ObjectDatastore;
import com.google.common.collect.ImmutableList;
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
	
	public List<Fish> getAll() {
		return ImmutableList.<Fish>of(
				new Fish("1", "Gigantshark"),
				new Fish("2", "Octomammoth"));
	}
}
