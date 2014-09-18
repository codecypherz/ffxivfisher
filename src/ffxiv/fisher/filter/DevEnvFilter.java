package ffxiv.fisher.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

import com.google.inject.Inject;
import com.google.inject.Singleton;

import ffxiv.fisher.Annotations.DevelopmentEnvironment;
import ffxiv.fisher.servlet.HttpResponseCode;

/**
 * A filter which only lets requests through if this is the development environment.
 */
@Singleton
public class DevEnvFilter implements Filter {
	
	private final boolean isDevelopmentEnvironment;
	
	@Inject
	public DevEnvFilter(@DevelopmentEnvironment boolean isDevelopmentEnvironment) {
		this.isDevelopmentEnvironment = isDevelopmentEnvironment;
	}
	
	@Override
	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain filterChain)
			throws IOException, ServletException {
		if (isDevelopmentEnvironment) {
			filterChain.doFilter(req, resp);
			return;
		}
		((HttpServletResponse) resp).sendError(HttpResponseCode.FORBIDDEN.getCode());
	}
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}
	
	@Override
	public void destroy() {
	}
}
