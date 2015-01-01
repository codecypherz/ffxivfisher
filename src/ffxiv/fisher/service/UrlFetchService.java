package ffxiv.fisher.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;

import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class UrlFetchService {

	@Inject
	public UrlFetchService() {
		
	}
	
	public String getRawData(String stringUrl) {
		URL url;
		try {
			url = new URL(stringUrl);			
		} catch (MalformedURLException e) {
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
			// Nothing to do
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e2) {
					// Nothing to do.
				}
			}
		}
        
        return null;
	}
}
