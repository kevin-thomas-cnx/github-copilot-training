package com.example.weatherapp;

import com.example.weatherapp.model.LocationsResponse;
import com.example.weatherapp.model.ErrorResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/locations")
public class LocationsController {
    @Autowired
    private LocationService locationService;

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> searchLocations(@RequestParam(required = false) String query) {
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Missing required query parameter: 'query'"));
        }
        var results = locationService.search(query);
        if (results.isEmpty()) {
            return ResponseEntity.status(404).body(new ErrorResponse("No locations found matching the search query."));
        }
        return ResponseEntity.ok(new LocationsResponse(results));
    }
}
