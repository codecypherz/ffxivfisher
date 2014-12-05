package ffxiv.fisher.service;

import java.util.logging.Logger;

import com.google.inject.Inject;
import com.google.inject.Singleton;

import ffxiv.fisher.model.WeatherReport;

@Singleton
public class SkywatcherService {
	
	private static final Logger log = Logger.getLogger(SkywatcherService.class.getName());
	
	private static final String SOURCE = "http://na.ff14angler.com/skywatcher.php";
	
	private static final long MIN_WAIT_TIME_MS = 60 * 1000; // 1 minute.
	
	private final UrlFetchService urlFetchService;
	private final WeatherParser parser;
	
	private WeatherReport weatherReport;
	private long lastUpdate;
	
	@Inject
	public SkywatcherService(
			UrlFetchService urlFetchService,
			WeatherParser parser) {
		this.urlFetchService = urlFetchService;
		this.parser = parser;
		
		weatherReport = null;
		lastUpdate = 0;
	}
	
	public synchronized WeatherReport getCurrentWeatherReport() {
		long currentMs = System.currentTimeMillis();
		
		// Is the weather report too stale?
		boolean tooStale =
				(weatherReport == null) ||
				((currentMs - lastUpdate) > MIN_WAIT_TIME_MS);
		
		// Update if too stale.
		if (tooStale) {
			log.info("Requesting data from source");
			weatherReport = parser.parse(urlFetchService.getRawData(SOURCE));
			lastUpdate = System.currentTimeMillis();
		}
		
		// Return the current weather report.
		return weatherReport;
	}
}
