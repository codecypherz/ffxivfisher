package ffxiv.fisher.servlet;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.memcache.MemcacheService;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Singleton;

import ffxiv.fisher.model.Fish;
import ffxiv.fisher.service.FishService;

/**
 * Serves queries for fish.
 */
@Singleton
public class FishesServlet extends HttpServlet {
	
	private static final long serialVersionUID = -8372385733325260330L;
	
	private static final Logger log = Logger.getLogger(FishesServlet.class.getName());
	
	private final FishService fishService;
	private final MemcacheService memcacheService;
	
	@Inject
	public FishesServlet(
			FishService fishesService,
			MemcacheService memcacheService) {
		this.fishService = fishesService;
		this.memcacheService = memcacheService;
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		boolean cacheMiss = true;
		Object fishesObject = memcacheService.get(FishService.FISHES_KEY);
		if (fishesObject != null) {
			log.info("Memcache hit for all fish.");
			cacheMiss = false;
			String allFishJson = (String) fishesObject;
			resp.getWriter().write(allFishJson);
			return; // Return now so no data is fetched from the database.
		} else {
			log.info("Memcache miss for all fish.");
		}

		// Memcache did not have the fish, so fetch from the database.
		List<Fish> allFish = fishService.getAll();
		
		Gson gson = new Gson();
		String allFishJson = gson.toJson(allFish);
		
		if (cacheMiss) {
			// Save the response in memcache so subsequent requests are wicked fast.
			log.info("Storing all fish in memcache");
			memcacheService.put(FishService.FISHES_KEY, allFishJson);
		}
		
		// Finally, write the response to the client.
		resp.getWriter().write(allFishJson);
	}
}
