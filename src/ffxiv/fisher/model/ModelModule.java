package ffxiv.fisher.model;

import java.lang.reflect.Type;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;

import ffxiv.fisher.Annotations.FishDeserializer;

public class ModelModule extends AbstractModule {

	@Override
	protected void configure() {
	}

	@Provides
	@FishDeserializer
	private Gson provideFishDeserializer() {
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
