package ffxiv.fisher.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class HomeServlet extends HttpServlet {
	
	private static final long serialVersionUID = -2778887191917652176L;
	
	private PageWriter pageWriter;
	
	@Inject
	public HomeServlet(PageWriter pageWriter) {
		this.pageWriter = pageWriter;
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		pageWriter.write(Page.HOME);
	}
}
