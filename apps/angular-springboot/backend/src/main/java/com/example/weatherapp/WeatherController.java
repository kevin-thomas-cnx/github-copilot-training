package com.example.weatherapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/forecast")
public class WeatherController {
    @Autowired
    private WeatherService weatherService;

    @GetMapping(value = "/week", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getWeeklyForecast(
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false, defaultValue = "metric") String units) {
        if (latitude == null || longitude == null) {
            return ResponseEntity.badRequest().body(new com.example.weatherapp.model.ErrorResponse("Missing or invalid coordinates."));
        }
        var result = weatherService.getWeeklyForecast(latitude, longitude, units);
        if (result == null) {
            return ResponseEntity.status(503).body(new com.example.weatherapp.model.ErrorResponse("Weather service is currently unavailable."));
        }
        // Return the full response object (with forecast field)
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/hourly", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getHourlyForecast(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {
        if (lat == null || lon == null) {
            return ResponseEntity.badRequest().body(new com.example.weatherapp.model.ErrorResponse("Invalid or missing parameters"));
        }
        var result = weatherService.getHourlyForecast(lat, lon);
        if (result == null) {
            return ResponseEntity.status(502).body(new com.example.weatherapp.model.ErrorResponse("Upstream weather provider error"));
        }
        // Return the full response object (with hourly field)
        return ResponseEntity.ok(result);
    }
}
