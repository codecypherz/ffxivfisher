package ffxiv.fisher.servlet.admin;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.inject.Inject;
import com.google.inject.Singleton;

import ffxiv.fisher.model.Fish;
import ffxiv.fisher.model.FishSerializer;
import ffxiv.fisher.service.FishService;
import ffxiv.fisher.servlet.HttpResponseCode;

/**
 * Adds a new fish to the database.  Meant for administrators only.
 */
@Singleton
public class AdminFishServlet extends HttpServlet {

	private static final long serialVersionUID = 337121127107680287L;
	
	private final FishService fishService;
	private final FishSerializer fishSerializer;
	
	@Inject
	public AdminFishServlet(
			FishService fishesService,
			FishSerializer fishSerializer) {
		this.fishService = fishesService;
		this.fishSerializer = fishSerializer;
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		// Parse the fish.
		Fish fish = fishSerializer.deserialize(req.getReader());
		
		try {
			if (fish.getKey() != null && !fish.getKey().isEmpty()) {
				fish = fishService.update(fish);
			} else {
				fish = fishService.create(fish);
			}
		} catch (IllegalArgumentException e) {
			resp.sendError(HttpResponseCode.BAD_REQUEST.getCode());
			return;
		}
		
		// Write the fish back out to the client using the default serializer.
		resp.getWriter().write(fishSerializer.serialize(fish));
	}
}
