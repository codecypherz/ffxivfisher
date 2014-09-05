package ffxiv.fisher.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Singleton;

import ffxiv.fisher.service.SkywatcherService;

@Singleton
public class SkywatcherServlet extends HttpServlet {
	
	private static final long serialVersionUID = -6480722152886842890L;
	
	private final SkywatcherService skywatcherService;
	
	@Inject
	public SkywatcherServlet(SkywatcherService skywatcherService) {
		this.skywatcherService = skywatcherService;
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		Gson gson = new Gson();
	    resp.getWriter().write(gson.toJson(skywatcherService.getCurrentWeather()));
	}
}
