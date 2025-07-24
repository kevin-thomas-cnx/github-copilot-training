package com.example.weatherapp.model;

import java.util.List;

public class LocationsResponse {
    private List<Location> locations;

    public LocationsResponse() {}

    public LocationsResponse(List<Location> locations) {
        this.locations = locations;
    }

    public List<Location> getLocations() {
        return locations;
    }

    public void setLocations(List<Location> locations) {
        this.locations = locations;
    }
}
