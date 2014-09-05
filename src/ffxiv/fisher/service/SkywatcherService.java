package ffxiv.fisher.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
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
			.put(10, Weather.THUNDERSTORM)
			.put(11, Weather.DUST_STORMS)
			.put(12, Weather.SANDSTORMS)
			.put(13, Weather.HOT_SPELLS)
			.put(14, Weather.HEAT_WAVE)
			.put(15, Weather.SNOW)
			.put(16, Weather.BLIZZARDS)
			.put(17, Weather.AURORA)
			.put(18, Weather.GLOOM)
			.build();
	
	private static final long MIN_WAIT_TIME_MS = 5 * 60 * 1000; // 5 minutes.
	
	private Map<Area, List<Weather>> weatherMap;
	private long lastUpdate;
	
	@Inject
	public SkywatcherService() {
		weatherMap = null;
		lastUpdate = 0;
	}
	
	public synchronized Map<Area, List<Weather>> getCurrentWeather() {
		long currentMs = System.currentTimeMillis();
		if (weatherMap == null || ((currentMs - lastUpdate) > MIN_WAIT_TIME_MS)) {
			updateFromSource();
			lastUpdate = System.currentTimeMillis();
		}
		return weatherMap;
	}
	
	private void updateFromSource() {
		String rawDataString = getRawData();
		if (rawDataString == null) {
			return;
		}
		log.info("Parsing data from source.");
		
		Gson gson = new Gson();
		RawData rawData = gson.fromJson(rawDataString, RawData.class);
		
		Map<Area, List<Weather>> newMap = new HashMap<Area, List<Weather>>();
		for (RawDataPoint dataPoint : rawData.data) {
			Area area = TO_AREA.get(dataPoint.area);
			
			// Skip non fishing areas.
			if (area == null) {
				continue;
			}
			
			// Setup the weather array if need be.
			List<Weather> weatherList = newMap.get(area);
			if (weatherList == null) {
				weatherList = new ArrayList<Weather>(4);
				for (int i = 0; i < 4; i++) {
					weatherList.add(null);
				}
			}
			
			// Parse and set weather.
			Weather weather = TO_WEATHER.get(dataPoint.weather);
			weatherList.set(dataPoint.time, weather);
			newMap.put(area, weatherList);
			
			// Special case the areas that share weather.
			if (area == Area.LIMSA_LOMINSA_LOWER_DECKS) {
				newMap.put(Area.LIMSA_LOMINSA_UPPER_DECKS, weatherList);
			} else if (area == Area.NEW_GRIDANIA) {
				newMap.put(Area.OLD_GRIDANIA, weatherList);
			}
		}
		weatherMap = newMap;
	}
	
	private String getRawData() {
		log.info("Getting raw data from source.");
		URL url;
		try {
			url = new URL(SOURCE);			
		} catch (MalformedURLException e) {
			log.log(Level.SEVERE, "Failed to parse source URL.", e);
			return null;
		}
		
		BufferedReader in = null;
		try {
			in = new BufferedReader(new InputStreamReader(url.openStream()));

	        StringBuilder sb = new StringBuilder();
	        String inputLine;
	        while ((inputLine = in.readLine()) != null) {
	            sb.append(inputLine);
	        }
	        return sb.toString();
	        
		} catch (IOException e) {
			log.log(Level.SEVERE, "Failed to read data from source.", e);
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e2) {
					log.log(Level.SEVERE, "Failed to close input stream.", e2);
				}
			}
		}
        
        return null;
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
}
