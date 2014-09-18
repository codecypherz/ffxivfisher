package ffxiv.fisher.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Singleton;

import ffxiv.fisher.model.Area;
import ffxiv.fisher.model.Weather;

@Singleton
public class SkywatcherService {

	private static final Logger log = Logger.getLogger(SkywatcherService.class.getName());
	
	private static final String SOURCE = "http://na.ff14angler.com/skywatcher.php";

	private static final Map<Integer, Area> TO_AREA =
			ImmutableMap.<Integer, Area>builder()
			.put(1, Area.LIMSA_LOMINSA_LOWER_DECKS) // Maps to LIMSA_LOMINSA_LOWER_DECKS too.
			.put(2, Area.MIDDLE_LA_NOSCEA)
			.put(3, Area.LOWER_LA_NOSCEA)
			.put(4, Area.EASTERN_LA_NOSCEA)
			.put(5, Area.WESTERN_LA_NOSCEA)
			.put(6, Area.UPPER_LA_NOSCEA)
			.put(7, Area.OUTER_LA_NOSCEA)
			//.put(8, Area.WOLVES_DEN_PIER) // No fishing here.
			.put(9, Area.MIST)
			.put(10, Area.NEW_GRIDANIA) // Maps to OLD_GRIDANIA too.
			.put(11, Area.CENTRAL_SHROUD)
			.put(12, Area.EAST_SHROUD)
			.put(13, Area.SOUTH_SHROUD)
			.put(14, Area.NORTH_SHROUD)
			.put(15, Area.LAVENDER_BEDS)
			//.put(16, Area.ULDAH) // No fishing here.
			.put(17, Area.WESTERN_THANALAN)
			.put(18, Area.CENTRAL_THANALAN)
			.put(19, Area.EASTERN_THANALAN)
			.put(20, Area.SOUTHERN_THANALAN)
			.put(21, Area.NORTHERN_THANALAN)
			.put(22, Area.THE_GOBLET)
			.put(23, Area.COERTHAS_CENTRAL_HIGHLANDS)
			.put(24, Area.MOR_DHONA)
			.build();
	
	private static final Map<Integer, Weather> TO_WEATHER =
			ImmutableMap.<Integer, Weather>builder()
			.put(1, Weather.CLEAR)
			.put(2, Weather.FAIR)
			.put(3, Weather.OVERCAST)
			.put(4, Weather.FOG)
			.put(5, Weather.WIND)
			.put(6, Weather.GALES)
			.put(7, Weather.RAIN)
			.put(8, Weather.SHOWERS)
			.put(9, Weather.THUNDER)
			.put(10, Weather.THUNDERSTORMS)
			.put(11, Weather.DUST_STORMS)
			.put(12, Weather.SANDSTORMS)
			.put(13, Weather.HOT_SPELLS)
			.put(14, Weather.HEAT_WAVE)
			.put(15, Weather.SNOW)
			.put(16, Weather.BLIZZARDS)
			.put(17, Weather.AURORA)
			.put(18, Weather.GLOOM)
			.build();
	
	private static final long MIN_WAIT_TIME_MS = 60 * 1000; // 1 minute.
	
	private final UrlFetchService urlFetchService;
	private WeatherReport weatherReport;
	private long lastUpdate;
	
	@Inject
	public SkywatcherService(UrlFetchService urlFetchService) {
		this.urlFetchService = urlFetchService;

		weatherReport = null;
		lastUpdate = 0;
	}
	
	public synchronized WeatherReport getCurrentWeatherReport() {
		long currentMs = System.currentTimeMillis();
		if (weatherReport == null || ((currentMs - lastUpdate) > MIN_WAIT_TIME_MS)) {
			updateFromSource();
			lastUpdate = System.currentTimeMillis();
		}
		return weatherReport;
	}
	
	private void updateFromSource() {
		String rawDataString = urlFetchService.getRawData(SOURCE);
		if (rawDataString == null) {
			return;
		}
		log.info("Parsing data from source.");
		
		Gson gson = new Gson();
		RawData rawData = gson.fromJson(rawDataString, RawData.class);
		
		Map<Area, List<Weather>> weatherMap = new HashMap<Area, List<Weather>>();
		for (RawDataPoint dataPoint : rawData.data) {
			Area area = TO_AREA.get(dataPoint.area);
			
			// Skip non fishing areas.
			if (area == null) {
				continue;
			}
			
			// Setup the weather array if need be.
			List<Weather> weatherList = weatherMap.get(area);
			if (weatherList == null) {
				weatherList = new ArrayList<Weather>(4);
				for (int i = 0; i < 4; i++) {
					weatherList.add(null);
				}
			}
			
			// Parse and set weather.
			Weather weather = TO_WEATHER.get(dataPoint.weather);
			weatherList.set(dataPoint.time, weather);
			weatherMap.put(area, weatherList);
			
			// Special case the areas that share weather.
			if (area == Area.LIMSA_LOMINSA_LOWER_DECKS) {
				weatherMap.put(Area.LIMSA_LOMINSA_UPPER_DECKS, weatherList);
			} else if (area == Area.NEW_GRIDANIA) {
				weatherMap.put(Area.OLD_GRIDANIA, weatherList);
			}
		}
		
		weatherReport = new WeatherReport(weatherMap, rawData.hour);
	}
	
	@SuppressWarnings("unused")
	private static class RawData {
		int hour;
		int minute;
		int left_hour;
		int left_minute;
		List<RawDataPoint> data;
	}
	
	@SuppressWarnings("unused")
	private static class RawDataPoint {
		int time;
		int area;
		int weather;
		transient int html;
	}
	
	public static class WeatherReport {
		private final Map<Area, List<Weather>> weatherMap;
		private final int eorzeaHour;
		
		public WeatherReport(Map<Area, List<Weather>> weatherMap, int eorzeaHour) {
			this.weatherMap = weatherMap;
			this.eorzeaHour = eorzeaHour;
		}
		
		public Map<Area, List<Weather>> getWeatherMap() {
			return weatherMap;
		}
		
		public int getEorzeaHour() {
			return eorzeaHour;
		}
	}
}
