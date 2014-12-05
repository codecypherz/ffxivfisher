package ffxiv.fisher.model;

import java.util.List;
import java.util.Map;

public class WeatherReport {
	
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
