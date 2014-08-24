package ffxiv.fisher;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;

import ffxiv.fisher.Annotations.FrontendVersion;
import ffxiv.fisher.model.TwigModule;
import ffxiv.fisher.servlet.FishServletModule;
import ffxiv.fisher.servlet.HttpParameterModule;

public class FishServerModule extends AbstractModule {

	@Override
	protected void configure() {
		install(new FishServletModule());
		install(new TwigModule());
		install(new HttpParameterModule());
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
	
	@Provides @Singleton
	public UserService provideUserService() {
		return UserServiceFactory.getUserService();
	}
}
