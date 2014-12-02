package ffxiv.fisher.servlet;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.memcache.AsyncMemcacheService;
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
	private static final String FISHES_KEY = "fishes";
	
	private final FishService fishService;
	private final AsyncMemcacheService memcacheService;
	
	@Inject
	public FishesServlet(
			FishService fishesService,
			AsyncMemcacheService memcacheService) {
		this.fishService = fishesService;
		this.memcacheService = memcacheService;
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		// TODO Race with memcache in case memcache has a bad long-tail?
		// This requires FishService to be async.
		Future<Object> fishesFuture = memcacheService.get(FISHES_KEY);
		try {
			Object fishesObject = fishesFuture.get();
			if (fishesObject != null) {
				String allFishJson = (String) fishesObject;
				log.info("Memcache hit for all fish.");
				resp.getWriter().write(allFishJson);
				return; // Return now so no data is fetched from the database.
			} else {
				log.info("Memcache miss for all fish.");
			}
		} catch (InterruptedException | ExecutionException e) {
			log.log(Level.SEVERE, "Failed to talk to memcache.", e);
		}

		// Memcache did not have the fish, so fetch from the database.
		List<Fish> allFish = fishService.getAll();
		
		// Save the response in memcache so subsequent requests are wicked fast.
		Gson gson = new Gson();
		String allFishJson = gson.toJson(allFish);
		memcacheService.put(FISHES_KEY, allFishJson); // async
		
		// Finally, write the response to the client.
		resp.getWriter().write(allFishJson);
	}
}
