package ffxiv.fisher.model;

import com.google.code.twig.ObjectDatastore;
import com.google.code.twig.ObjectDatastoreFactory;
import com.google.code.twig.annotation.AnnotationObjectDatastore;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.servlet.RequestScoped;

public class TwigModule extends AbstractModule {

	@Override
	protected void configure() {
		ObjectDatastoreFactory.register(Fish.class);
	}
	
	@Provides @RequestScoped
	private ObjectDatastore provideObjectDatastore() {
		return new AnnotationObjectDatastore(
				false /* Not indexed by default */);
	}
}
