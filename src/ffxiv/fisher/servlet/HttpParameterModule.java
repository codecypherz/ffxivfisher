package ffxiv.fisher.servlet;

import java.nio.charset.Charset;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;

import com.google.appengine.api.utils.SystemProperty;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;

public class HttpParameterModule extends AbstractModule {

	private static final Logger log = Logger.getLogger(HttpParameterModule.class.getName());

	/**
	 * The UTF_8 charset.
	 */
	private static Charset UTF_8 = Charset.forName("UTF-8");
	
	@Override
	protected void configure() {
	}
	
	@Provides
	public ServingMode provideServingMode(HttpServletRequest req) {
		String servingModeParam = getParam(req, UrlParameter.SERVING_MODE);
		if (servingModeParam != null) {
			try {
				ServingMode servingMode = ServingMode.valueOf(servingModeParam.toUpperCase());
				if (ServingMode.DEV == servingMode &&
						SystemProperty.Environment.Value.Production == SystemProperty.environment.value()) {
					log.severe("Cannot request dev mode in production environment");
				}
				return servingMode;
			} catch (Exception e) {
				return null;
			}
		}
		return ServingMode.PROD;
	}
	
	/**
	 * Gets the desired parameter from the request object.
	 * @param req The HTTP servlet request.
	 * @param param The parameter to retrieve.
	 * @return The parameter or null if there was none.
	 */
	public static String getParam(HttpServletRequest req, UrlParameter param) {

		// There is a bug when dealing with Firefox (doesn't happen with Chrome
		// for some reason).  You cannot call both req.getParameter() AND
		// req.getReader() without getting an exception.  This is used whenever
		// JSON is posted to a servlet, so to get around this, the method here
		// will parse the raw query string instead of using req.getParameter.
		//
		// See this for more detail on the bug - there might be another fix:
		// http://jira.codehaus.org/browse/JETTY-477
		// and
		// http://jira.codehaus.org/browse/JETTY-1291

		List<NameValuePair> pairs = URLEncodedUtils.parse(req.getQueryString(), UTF_8);

		for (NameValuePair pair : pairs) {
			if (pair.getName().equalsIgnoreCase(param.toString())) {
				String value = pair.getValue();
				if (value != null) {
					return value.trim();
				}
			}
		}
		return null;
	}
}
