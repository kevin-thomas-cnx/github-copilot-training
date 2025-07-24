package com.example.weatherapp;

import com.example.weatherapp.model.Location;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class LocationService {
    @Value("classpath:data/locations.json")
    private Resource locationsResource;

    private List<Location> locations = new ArrayList<>();

    @PostConstruct
    public void loadLocations() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        locations = mapper.readValue(locationsResource.getInputStream(), new TypeReference<List<Location>>() {});
    }

    public List<Location> search(String query) {
        String q = query.toLowerCase(Locale.ROOT);
        return locations.stream()
                .filter(loc -> loc.getName().toLowerCase(Locale.ROOT).contains(q)
                        || (loc.getAirportCode() != null && loc.getAirportCode().toLowerCase(Locale.ROOT).contains(q)))
                .collect(Collectors.toList());
    }

    // Setter for test injection
    void setLocationsResource(Resource resource) {
        this.locationsResource = resource;
    }
}
