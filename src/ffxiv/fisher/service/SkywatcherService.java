package ffxiv.fisher.service;

import com.google.inject.Inject;
import com.google.inject.Singleton;

import ffxiv.fisher.model.WeatherReport;

@Singleton
public class SkywatcherService {
	
	private static final String SOURCE = "http://na.ff14angler.com/skywatcher.php";
	
	private static final long MIN_WAIT_TIME_MS = 60 * 1000; // 1 minute.
	
	private final UrlFetchService urlFetchService;
	private final WeatherParser parser;
	private final FishService fishService;
	
	private WeatherReport weatherReport;
	private long lastUpdate;
	
	@Inject
	public SkywatcherService(
			UrlFetchService urlFetchService,
			WeatherParser parser,
			FishService fishService) {
		this.urlFetchService = urlFetchService;
		this.parser = parser;
		this.fishService = fishService;
		
		weatherReport = null;
		lastUpdate = 0;
	}
	
	/**
	 * Gets the current weather report.  If the report is uninitialized or too
	 * stale, then a new weather report is created.
	 */
	public synchronized WeatherReport getCurrentWeatherReport() {
		long currentMs = System.currentTimeMillis();
		
		// Is the weather report too stale?
		boolean tooStale =
				(weatherReport == null) ||
				((currentMs - lastUpdate) > MIN_WAIT_TIME_MS);
		
		// Update if too stale.
		if (tooStale) {
			weatherReport = parser.parse(urlFetchService.getRawData(SOURCE));
			lastUpdate = System.currentTimeMillis();
			
			// Hack to keep memcache fresh without costing too much.  This call
			// will be at the rate of weather refresh so this only works if
			// weather refresh time is less than memcache eviction time.
			fishService.keepMemcacheAlive();
		}
		
		// Return the current weather report.
		return weatherReport;
	}
}
