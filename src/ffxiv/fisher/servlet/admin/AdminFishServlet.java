package ffxiv.fisher.servlet.admin;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.Singleton;

import ffxiv.fisher.Annotations.FishDeserializer;
import ffxiv.fisher.model.Fish;
import ffxiv.fisher.service.FishService;
import ffxiv.fisher.servlet.HttpResponseCode;

/**
 * Adds a new fish to the database.  Meant for administrators only.
 */
@Singleton
public class AdminFishServlet extends HttpServlet {

	private static final Logger log = Logger.getLogger(AdminFishServlet.class.getName());
	
	private static final long serialVersionUID = 337121127107680287L;
	
	private final FishService fishService;
	private final Provider<Gson> fishDeserializerProvider;
	
	@Inject
	public AdminFishServlet(
			FishService fishesService,
			@FishDeserializer Provider<Gson> fishDeserializerProvider) {
		this.fishService = fishesService;
		this.fishDeserializerProvider = fishDeserializerProvider;
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		// Parse the fish.
		Fish fish = fishDeserializerProvider.get().fromJson(req.getReader(), Fish.class);
		
		try {
			if (fish.getKey() != null && !fish.getKey().isEmpty()) {
				fish = fishService.update(fish);
			} else {
				fish = fishService.create(fish);
			}
		} catch (IllegalArgumentException e) {
			log.severe(e.getMessage());
			resp.sendError(HttpResponseCode.BAD_REQUEST.getCode());
			return;
		}
		
		// Write the fish back out to the client using the default serializer.
		resp.getWriter().write(new Gson().toJson(fish));
	}
}
