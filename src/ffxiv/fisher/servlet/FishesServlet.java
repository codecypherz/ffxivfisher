package ffxiv.fisher.servlet;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
	
	private final FishService fishService;
	
	@Inject
	public FishesServlet(FishService fishesService) {
		this.fishService = fishesService;
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		List<Fish> allFish = fishService.getAll();
		Gson gson = new Gson();
		resp.getWriter().write(gson.toJson(allFish));
	}
}
