package ffxiv.fisher.servlet.admin;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.inject.Inject;
import com.google.inject.Singleton;

import ffxiv.fisher.Annotations.DevelopmentEnvironment;
import ffxiv.fisher.model.Fish;
import ffxiv.fisher.model.FishSerializer;
import ffxiv.fisher.service.FishService;
import ffxiv.fisher.service.UrlFetchService;

/**
 * Copies all data from production to the local database.
 */
@Singleton
public class CopyProdToLocalServlet extends HttpServlet {
	
	private static final long serialVersionUID = -1618388594334206517L;
	
	private static final String SOURCE = "http://ffxivfisher.appspot.com/fishes";
	
	private final UrlFetchService urlFetchService;
	private final FishService fishService;
	private final FishSerializer fishSerializer;
	private final boolean isDevelopmentEnvironment;
	
	@Inject
	public CopyProdToLocalServlet(
			UrlFetchService urlFetchService,
			FishService fishService,
			FishSerializer fishSerializer,
			@DevelopmentEnvironment boolean isDevelopmentEnvironment) {
		this.urlFetchService = urlFetchService;
		this.fishService = fishService;
		this.fishSerializer = fishSerializer;
		this.isDevelopmentEnvironment = isDevelopmentEnvironment;
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		if (!isDevelopmentEnvironment) {
			return;
		}
		
		// Fetch the prod data.
		String fishesJson = urlFetchService.getRawData(SOURCE);
		List<Fish> fishes = fishSerializer.deserializeAll(fishesJson);
		
		// Delete all local data.
		fishService.deleteAll();
		
		// Save all prod data.
		for (Fish fish : fishes) {
			fishService.createWithoutValidation(fish);
		}
		
		resp.getWriter().write("Downloaded " + fishes.size() + " fish from production.");
	}
}
