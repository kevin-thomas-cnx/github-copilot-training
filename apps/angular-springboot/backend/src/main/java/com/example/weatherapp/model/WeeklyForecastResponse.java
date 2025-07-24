package com.example.weatherapp.model;

import java.util.List;

public class WeeklyForecastResponse {
    private double latitude;
    private double longitude;
    private String units;
    private List<DailyForecast> forecast;

    public WeeklyForecastResponse() {}

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getUnits() { return units; }
    public void setUnits(String units) { this.units = units; }

    public List<DailyForecast> getForecast() { return forecast; }
    public void setForecast(List<DailyForecast> forecast) { this.forecast = forecast; }
}
