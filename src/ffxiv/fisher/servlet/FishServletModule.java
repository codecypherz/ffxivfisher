package ffxiv.fisher.servlet;

import com.google.inject.Provides;
import com.google.inject.servlet.ServletModule;

public class FishServletModule extends ServletModule {

	@Override
	protected void configureServlets() {
		serve("/").with(HomeServlet.class);
		serve("/fishes").with(FishesServlet.class);
	}
	
	@Provides
	public JsMode provideJsMode() {
		// TODO Pull the mode from the request.  If raw, authenticate.
		return JsMode.RAW;
	}
}
