package ffxiv.fisher.servlet;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.CharBuffer;

import javax.servlet.http.HttpServletResponse;

import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.Singleton;

import ffxiv.fisher.Annotations.FrontendVersion;

@Singleton
public class PageWriter {

	private Provider<ServingMode> servingModeProvider;
	private Provider<HttpServletResponse> responseProvider;
	private Provider<String> frontendVersionProvider;
	
	@Inject
	public PageWriter(
			Provider<ServingMode> jsModeProvider,
			Provider<HttpServletResponse> responseProvider,
			@FrontendVersion Provider<String> frontendVersionProvider) {
		this.servingModeProvider = jsModeProvider;
		this.responseProvider = responseProvider;
		this.frontendVersionProvider = frontendVersionProvider;
	}

	/**
	 * Writes a standard web page back to the client.
	 * @param req The request.
	 * @param resp The response.
	 * @param page The page to write.
	 * @throws FileNotFoundException Thrown when any of the paths are wrong.
	 * @throws IOException Thrown if any of the files can't be read.
	 */
	public void write(Page page) throws FileNotFoundException, IOException {

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
		if (servingMode == ServingMode.PROD) {
			html = replaceParam(html, HtmlParameter.JS_FILE_PATH, page.getJsFilePath(frontendVersion));
		}
		html = replaceParam(html, HtmlParameter.CSS_FILE_PATH, page.getCssFilePath(frontendVersion));
		
		HttpServletResponse resp = responseProvider.get();
	    resp.setContentType("text/html");
	    resp.getWriter().write(html);
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
