package ffxiv.fisher.model;

import java.io.Reader;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;
import com.google.inject.Singleton;

/**
 * Object that can serialize and deserialize fish.
 */
@Singleton
public class FishSerializer {
	
	public String serialize(Object obj) {
		return new Gson().toJson(obj);
	}
	
	public Fish deserialize(String oneFishJson) {
		Gson gson = createDeserializer();
		return gson.fromJson(oneFishJson, Fish.class);
	}
	
	public Fish deserialize(Reader oneFishReader) {
		Gson gson = createDeserializer();
		return gson.fromJson(oneFishReader, Fish.class);
	}
	
	public List<Fish> deserializeAll(String allFishJson) {
		Type listType = new TypeToken<ArrayList<Fish>>() { }.getType();
		Gson gson = createDeserializer();
		return gson.fromJson(allFishJson, listType);
	}
	
	/**
	 * Creates a special deserializer that understand CatchPathParts.
	 */
	private Gson createDeserializer() {
		// Handle the special deserialization of CatchPathPart.
		return new GsonBuilder().registerTypeAdapter(
				CatchPathPart.class,
				new JsonDeserializer<CatchPathPart>() {
					@Override
					public CatchPathPart deserialize(JsonElement element,
							Type type, JsonDeserializationContext context)
							throws JsonParseException {
						final JsonObject wrapper = (JsonObject) element;
						final JsonElement fishingTackle = wrapper.get("fishingTackle");
				        if (fishingTackle != null) {
				        	return context.deserialize(element, StraightCatch.class);
				        }
				        return context.deserialize(element, Mooch.class);
					}
				}).create();
	}
}
