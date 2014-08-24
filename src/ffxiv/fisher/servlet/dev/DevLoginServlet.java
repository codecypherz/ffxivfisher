package ffxiv.fisher.servlet.dev;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.UserService;
import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class DevLoginServlet extends HttpServlet {
	
	private static final long serialVersionUID = -7302362064805004547L;
	
	private final UserService userService;
	
	@Inject
	public DevLoginServlet(UserService userService) {
		this.userService = userService;
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String currentStatus = "";
		String linkHref = "";
		String linkText = "";
		
		// Always come back to this page.
		String destinationUrl = req.getRequestURI();
		
		if (userService.isUserLoggedIn()) {
			currentStatus = "You are currently logged in " +
					"(admin = " + userService.isUserAdmin() + ")";
			linkHref = userService.createLogoutURL(destinationUrl);
			linkText = "logout";
		} else {
			currentStatus = "You are currently logged out";
			linkHref = userService.createLoginURL(destinationUrl);
			linkText = "login";
		}
		
		userService.createLoginURL(req.getRequestURI());
		resp.setContentType("text/html");
	    resp.getWriter().write("<html><body>"
	    		+ currentStatus + "<br>"
	    		+ "<a href=\"" + linkHref + "\">" + linkText + "</a>"
	    		+ "</body></html>");
	}
}
