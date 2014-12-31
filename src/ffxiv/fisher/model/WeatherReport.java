package ffxiv.fisher.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.google.gson.annotations.SerializedName;

public class WeatherReport {
	
	@SerializedName("a")
	private final Map<Integer, List<Integer>> condensedWeatherMap;
	
	@SerializedName("b")
	private final int condensedEorzeaHour;
	
	public WeatherReport(Map<Area, List<Weather>> weatherMap, int eorzeaHour) {
		this.condensedWeatherMap = new HashMap<Integer, List<Integer>>();
		for (Entry<Area, List<Weather>> entry : weatherMap.entrySet()) {
			List<Integer> weatherInts = new ArrayList<Integer>(entry.getValue().size());
			for (Weather weather : entry.getValue()) {
				if (weather != null) {
					weatherInts.add(weather.getClientIdentifier());
				} else {
					weatherInts.add(null);
				}
			}
			condensedWeatherMap.put(
					entry.getKey().getClientIdentifier(),
					weatherInts);
		}
		this.condensedEorzeaHour = eorzeaHour;
	}
}
