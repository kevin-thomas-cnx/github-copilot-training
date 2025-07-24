package com.example.weatherapp;

import com.example.weatherapp.model.DailyForecast;
import com.example.weatherapp.model.WeeklyForecastResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@Service
public class WeatherService {
    private static final String OPEN_METEO_WEEKLY_URL = "https://api.open-meteo.com/v1/forecast";
    private static final String OPEN_METEO_HOURLY_URL = "https://api.open-meteo.com/v1/forecast";

    private RestTemplate restTemplate = new RestTemplate();

    public WeatherService() {}

    public WeatherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void setRestTemplate(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public WeeklyForecastResponse getWeeklyForecast(double latitude, double longitude, String units) {
        // Map units to Open-Meteo expected values
        String temperatureUnit;
        if ("C".equalsIgnoreCase(units) || "metric".equalsIgnoreCase(units)) {
            temperatureUnit = "celsius";
        } else if ("F".equalsIgnoreCase(units) || "imperial".equalsIgnoreCase(units)) {
            temperatureUnit = "fahrenheit";
        } else {
            temperatureUnit = "celsius"; // default
        }
        String url = UriComponentsBuilder.fromHttpUrl(OPEN_METEO_WEEKLY_URL)
                .queryParam("latitude", latitude)
                .queryParam("longitude", longitude)
                .queryParam("daily", "temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max")
                .queryParam("temperature_unit", temperatureUnit)
                .queryParam("timezone", "auto")
                .toUriString();
        String response = restTemplate.getForObject(url, String.class);
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            WeeklyForecastResponse result = new WeeklyForecastResponse();
            result.setLatitude(root.path("latitude").asDouble());
            result.setLongitude(root.path("longitude").asDouble());
            result.setUnits(temperatureUnit);
            List<DailyForecast> forecast = new ArrayList<>();
            JsonNode daily = root.path("daily");
            for (int i = 0; i < daily.path("time").size(); i++) {
                DailyForecast df = new DailyForecast();
                df.setDay(daily.path("time").get(i).asText());
                df.setWeatherCode(daily.path("weathercode").get(i).asInt());
                DailyForecast.Temperature temp = new DailyForecast.Temperature();
                temp.setMax(daily.path("temperature_2m_max").get(i).asDouble());
                temp.setMin(daily.path("temperature_2m_min").get(i).asDouble());
                df.setTemperature(temp);
                // Set precipitationChance if available, else 0
                if (daily.has("precipitation_probability_max")) {
                    df.setPrecipitationChance(daily.path("precipitation_probability_max").get(i).asDouble());
                } else {
                    df.setPrecipitationChance(0);
                }
                forecast.add(df);
            }
            result.setForecast(forecast);
            return result;
        } catch (Exception e) {
            return null;
        }
    }

    public Object getHourlyForecast(double latitude, double longitude) {
        String url = UriComponentsBuilder.fromHttpUrl(OPEN_METEO_HOURLY_URL)
                .queryParam("latitude", latitude)
                .queryParam("longitude", longitude)
                .queryParam("hourly", "temperature_2m,precipitation,weathercode")
                .queryParam("forecast_days", 1)
                .queryParam("timezone", "auto")
                .toUriString();
        String response = restTemplate.getForObject(url, String.class);
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            JsonNode hourly = root.path("hourly");
            // Build array of 24 hourly objects as expected by Karate tests
            List<Object> hourlyList = new ArrayList<>();
            for (int i = 0; i < 24 && i < hourly.path("time").size(); i++) {
                var hourObj = new java.util.HashMap<String, Object>();
                hourObj.put("hour", i);
                hourObj.put("temperature", hourly.path("temperature_2m").get(i).asDouble());
                hourObj.put("precipitationChance", hourly.path("precipitation").get(i).asDouble());
                hourlyList.add(hourObj);
            }
            java.util.Map<String, Object> result = new java.util.HashMap<>();
            result.put("hourly", hourlyList);
            return result;
        } catch (Exception e) {
            return null;
        }
    }
}
