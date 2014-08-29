package ffxiv.fisher.servlet;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.CharBuffer;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.Singleton;

import ffxiv.fisher.Annotations.FrontendVersion;
import ffxiv.fisher.model.User;

@Singleton
public class PageWriter {

	private Provider<ServingMode> servingModeProvider;
	private Provider<HttpServletResponse> responseProvider;
	private Provider<String> frontendVersionProvider;
	private Provider<User> userProvider;
	
	@Inject
	public PageWriter(
			Provider<ServingMode> jsModeProvider,
			Provider<HttpServletResponse> responseProvider,
			@FrontendVersion Provider<String> frontendVersionProvider,
			Provider<User> userProvider) {
		this.servingModeProvider = jsModeProvider;
		this.responseProvider = responseProvider;
		this.frontendVersionProvider = frontendVersionProvider;
		this.userProvider = userProvider;
	}

	/**
	 * Writes a standard web page back to the client.
	 * @param page The page to write.
	 * @throws FileNotFoundException Thrown when any of the paths are wrong.
	 * @throws IOException Thrown if any of the files can't be read.
	 */
	public void write(Page page) throws FileNotFoundException, IOException {
		write(page, new HashMap<HtmlParameter, String>());
	}
	
	/**
	 * Writes a standard web page back to the client.
	 * @param page The page to write.
	 * @param paramMap The extra parameters to replace.
	 * @throws FileNotFoundException Thrown when any of the paths are wrong.
	 * @throws IOException Thrown if any of the files can't be read.
	 */
	public void write(Page page, Map<HtmlParameter, String> paramMap)
			throws FileNotFoundException, IOException {
		ServingMode servingMode = servingModeProvider.get();

		// Get the HTML path.
		String htmlPath = page.getHtmlFilePath(servingMode);

		// Read in the HTML.
		FileReader reader = new FileReader(htmlPath);
	    CharBuffer buffer = CharBuffer.allocate(16384);
	    reader.read(buffer);
	    reader.close();
		String html = new String(buffer.array());

		String frontendVersion = frontendVersionProvider.get();
		
		// Put JS/CSS paths in the parameter map.
		Map<HtmlParameter, String> map = new HashMap<>(paramMap);
		if (servingMode == ServingMode.PROD) {
			map.put(HtmlParameter.JS_FILE_PATH, page.getJsFilePath(frontendVersion));
		}
		map.put(HtmlParameter.CSS_FILE_PATH, page.getCssFilePath(frontendVersion));
		map.put(HtmlParameter.USER_JSON, new Gson().toJson(userProvider.get()));
		
		// Replace everything.
		html = replaceParams(html, map);
		
		HttpServletResponse resp = responseProvider.get();
	    resp.setContentType("text/html");
	    resp.getWriter().write(html);
	}
	
	/**
	 * Replaces the parameter in the given HTML string with the value.
	 * @param html The HTML that needs to replace the key with the value.
	 * @param map The parameters to replace.
	 * @return
	 */
	private String replaceParams(String html, Map<HtmlParameter, String> map) {
		for (Entry<HtmlParameter, String> entry : map.entrySet()) {
			html = replaceParam(html, entry.getKey(), entry.getValue());
		}
		return html;
	}
	
	/**
	 * Replaces the parameter in the given HTML string with the value.
	 * @param html The HTML that needs to replace the key with the value.
	 * @param parameter The parameter to replace.
	 * @param value The value with which to replace the parameter.
	 * @return
	 */
	private String replaceParam(String html, HtmlParameter parameter, String value) {
		return html.replaceAll(
				"\\{\\{ " + parameter.toString() + " \\}\\}", value);
	}
}
