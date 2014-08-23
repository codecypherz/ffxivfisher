package ffxiv.fisher.servlet;

import java.nio.charset.Charset;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;

import com.google.inject.Provides;
import com.google.inject.servlet.ServletModule;

public class FishServletModule extends ServletModule {

	/**
	 * The UTF_8 charset.
	 */
	private static Charset UTF_8 = Charset.forName("UTF-8");
	
	@Override
	protected void configureServlets() {
		serve("/").with(FisherServlet.class);
		serve("/fishes").with(FishesServlet.class);
	}
	
	@Provides
	public ServingMode provideServingMode(HttpServletRequest req) {
		String servingMode = getParam(req, UrlParameter.SERVING_MODE);
		if (servingMode != null) {
			try {
				// TODO If dev, authenticate?
				return ServingMode.valueOf(servingMode.toUpperCase());
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
