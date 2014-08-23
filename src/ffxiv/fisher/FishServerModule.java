package ffxiv.fisher;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;

import ffxiv.fisher.Annotations.FrontendVersion;
import ffxiv.fisher.model.TwigModule;
import ffxiv.fisher.servlet.FishServletModule;

public class FishServerModule extends AbstractModule {

	@Override
	protected void configure() {
		install(new FishServletModule());
		install(new TwigModule());
	}
	
	/**
	 * The version of the application which is used to bust the cache for the
	 * JS/CSS bundles.
	 * TODO Pull this from the datastore?
	 */
	@Provides @FrontendVersion
	public String provideFrontendVersion() {
		return "0";
	}
}
