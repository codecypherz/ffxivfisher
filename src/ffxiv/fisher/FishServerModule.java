package ffxiv.fisher;

import java.util.logging.Level;

import com.google.appengine.api.memcache.AsyncMemcacheService;
import com.google.appengine.api.memcache.ErrorHandlers;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.utils.SystemProperty;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
import com.google.inject.servlet.RequestScoped;

import ffxiv.fisher.Annotations.DevelopmentEnvironment;
import ffxiv.fisher.Annotations.FrontendVersion;
import ffxiv.fisher.model.TwigModule;
import ffxiv.fisher.model.User;
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

	@Provides @Singleton
	public AsyncMemcacheService provideAsyncMemcacheService() {
		AsyncMemcacheService asyncMemcacheService =
				MemcacheServiceFactory.getAsyncMemcacheService();
		asyncMemcacheService.setErrorHandler(
				ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
		return asyncMemcacheService;
	}
	
	@Provides @Singleton
	public MemcacheService provideMemcacheService() {
		MemcacheService memcacheService = MemcacheServiceFactory.getMemcacheService();
		memcacheService.setErrorHandler(
				ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
		return memcacheService;
	}
	
	@Provides @RequestScoped
	public User provideCurrentUser(UserService userService) {
		User user = new User();
		com.google.appengine.api.users.User currentUser = userService.getCurrentUser();
		if (currentUser != null) {
			user = new User(
					currentUser.getNickname(),
					currentUser.getEmail(),
					true, // signed in
					userService.isUserAdmin());
		}
		return user;
	}
	
	@Provides @DevelopmentEnvironment
	public boolean provideDevelopmentEnvironment() {
		return SystemProperty.Environment.Value.Development == SystemProperty.environment.value();
	}
}
