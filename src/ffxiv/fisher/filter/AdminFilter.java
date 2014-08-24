package ffxiv.fisher.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import com.google.appengine.api.users.UserService;
import com.google.inject.Inject;
import com.google.inject.Singleton;

/**
 * A filter which only lets admin users through.
 */
@Singleton
public class AdminFilter implements Filter {
	
	private final UserService userService;
	
	@Inject
	public AdminFilter(UserService userService) {
		this.userService = userService;
	}
	
	@Override
	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain filterChain)
			throws IOException, ServletException {
		if (userService.isUserAdmin()) {
			filterChain.doFilter(req, resp);
		}
	}
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}
	
	@Override
	public void destroy() {
	}
}
