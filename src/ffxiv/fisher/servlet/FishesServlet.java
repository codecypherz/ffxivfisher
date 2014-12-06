package ffxiv.fisher.servlet;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.inject.Inject;
import com.google.inject.Singleton;

import ffxiv.fisher.model.Fish;
import ffxiv.fisher.model.FishSerializer;
import ffxiv.fisher.service.FishService;
import ffxiv.fisher.service.FishService.InvalidationCallback;

/**
 * Serves queries for fish.
 */
@Singleton
public class FishesServlet extends HttpServlet {
	
	private static final long serialVersionUID = -8372385733325260330L;
	
	private static final Logger log = Logger.getLogger(FishesServlet.class.getName());
	
	private final FishService fishService;
	private final FishSerializer fishSerializer;
	private final AtomicReference<String> jsonRef;
	
	@Inject
	public FishesServlet(FishService fishesService, FishSerializer fishSerializer) {
		this.fishService = fishesService;
		this.fishSerializer = fishSerializer;
		
		jsonRef = new AtomicReference<String>();
		
		// When fish change, wipe out the JSON reference.
		this.fishService.registerInvalidationCallback(
				new InvalidationCallback() {
					@Override
					public void invalidate() {
						jsonRef.set(null);
					}
				});
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		String allFishJson = jsonRef.get();
		if (allFishJson != null) {
			log.info("Serving fish JSON from memory.");
			resp.getWriter().write(allFishJson);
			return; // Return now so no data is fetched from the database.
		} else {
			log.info("JSON was not already in memory.");
		}
		
		// TODO Create metrics around the various cache hits.
		// We did not have the fish, so fetch from the database.
		List<Fish> allFish = fishService.getAll();
		
		allFishJson = fishSerializer.serialize(allFish);
		log.info("Saving fish JSON reference for next time.");
		jsonRef.compareAndSet(null, allFishJson);
		
		// Finally, write the response to the client.
		resp.getWriter().write(allFishJson);
	}
}
