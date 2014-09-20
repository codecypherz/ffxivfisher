package ffxiv.fisher.servlet.admin;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.inject.Inject;
import com.google.inject.Singleton;

import ffxiv.fisher.model.CatchPathPart;
import ffxiv.fisher.model.Fish;
import ffxiv.fisher.model.Mooch;
import ffxiv.fisher.model.StraightCatch;
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
	
	@Inject
	public AdminFishServlet(FishService fishesService) {
		this.fishService = fishesService;
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		// Handle the special deserialization of CatchPathPart.
		Gson gson = new GsonBuilder().registerTypeAdapter(
				CatchPathPart.class,
				new JsonDeserializer<CatchPathPart>() {
					@Override
					public CatchPathPart deserialize(JsonElement element,
							Type type, JsonDeserializationContext context)
							throws JsonParseException {
						final JsonObject wrapper = (JsonObject) element;
						final JsonElement fishingTackle = wrapper.get("fishingTackle");
				        if (fishingTackle != null) {
				        	return context.deserialize(element, StraightCatch.class);
				        }
				        return context.deserialize(element, Mooch.class);
					}
				}).create();
		
		// Parse the fish.
		Fish fish = gson.fromJson(req.getReader(), Fish.class);
		
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
