package ffxiv.fisher.servlet;

import com.google.inject.servlet.ServletModule;

import ffxiv.fisher.filter.AdminFilter;
import ffxiv.fisher.filter.DevEnvFilter;
import ffxiv.fisher.servlet.admin.AdminFishServlet;
import ffxiv.fisher.servlet.admin.CopyProdToLocalServlet;
import ffxiv.fisher.servlet.dev.DevLoginServlet;

public class FishServletModule extends ServletModule {
	
	@Override
	protected void configureServlets() {
		// Dev only.
		// TODO Add this back once sign-in is in prod.
		//filter("/dev/*").through(DevEnvFilter.class);
		serve("/dev/login").with(DevLoginServlet.class);
		filter("/dev/copyprod").through(DevEnvFilter.class);
		serve("/dev/copyprod").with(CopyProdToLocalServlet.class);
		
		// Admin only.
		filter("/admin/*").through(AdminFilter.class);
		serve("/admin/fish").with(AdminFishServlet.class);

		// Normal web access.
		serve("/").with(FisherServlet.class);
		serve("/fishes").with(FishesServlet.class);
		serve("/skywatcher").with(SkywatcherServlet.class);
	}
}
