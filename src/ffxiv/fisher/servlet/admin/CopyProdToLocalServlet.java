package ffxiv.fisher.servlet.admin;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.google.inject.Inject;
import com.google.inject.Singleton;

import ffxiv.fisher.Annotations.DevelopmentEnvironment;
import ffxiv.fisher.model.Fish;
import ffxiv.fisher.service.FishService;
import ffxiv.fisher.service.UrlFetchService;

/**
 * Copies all data from production to the local database.
 */
@Singleton
public class CopyProdToLocalServlet extends HttpServlet {
	
	private static final long serialVersionUID = -1618388594334206517L;
	
	private static final Logger log = Logger.getLogger(CopyProdToLocalServlet.class.getName());
	
	private static final String SOURCE = "http://ffxivfisher.appspot.com/fishes";
	
	private final UrlFetchService urlFetchService;
	private final FishService fishService;
	private final boolean isDevelopmentEnvironment;
	
	@Inject
	public CopyProdToLocalServlet(
			UrlFetchService urlFetchService,
			FishService fishService,
			@DevelopmentEnvironment boolean isDevelopmentEnvironment) {
		this.urlFetchService = urlFetchService;
		this.fishService = fishService;
		this.isDevelopmentEnvironment = isDevelopmentEnvironment;
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		if (!isDevelopmentEnvironment) {
			log.severe("Attempted to alter production data with a dev only servlet.");
			return;
		}
		
		log.info("Copying prod data to local DB.");
		
		// Fetch the prod data.
		String fishesJson = urlFetchService.getRawData(SOURCE);
		Gson gson = new Gson();
		Type listType = new TypeToken<ArrayList<Fish>>() { }.getType();
		List<Fish> fishes = gson.fromJson(fishesJson, listType);
		
		// Delete all local data.
		fishService.deleteAll();
		
		// Save all prod data.
		for (Fish fish : fishes) {
			fishService.createWithoutValidation(fish);
		}
		
		resp.getWriter().write("Downloaded " + fishes.size() + " fish from production.");
	}
}
