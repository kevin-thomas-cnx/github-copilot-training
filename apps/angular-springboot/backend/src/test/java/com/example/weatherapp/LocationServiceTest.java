package com.example.weatherapp;

import com.example.weatherapp.model.Location;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class LocationServiceTest {
    private LocationService locationService;

    @BeforeEach
    void setUp() throws IOException {
        locationService = new LocationService();
        locationService.setLocationsResource(new ClassPathResource("data/locations.json"));
        locationService.loadLocations();
    }

    @Test
    void search_shouldReturnMatchingCity() {
        List<Location> results = locationService.search("New York");
        assertFalse(results.isEmpty());
        assertTrue(results.stream().anyMatch(l -> l.getName().contains("New York")));
    }

    @Test
    void search_shouldReturnMatchingAirportCode() {
        List<Location> results = locationService.search("LAX");
        assertFalse(results.isEmpty());
        assertTrue(results.stream().anyMatch(l -> "LAX".equals(l.getAirportCode())));
    }

    @Test
    void search_shouldReturnEmptyForNoMatch() {
        List<Location> results = locationService.search("Atlantis");
        assertTrue(results.isEmpty());
    }
}
