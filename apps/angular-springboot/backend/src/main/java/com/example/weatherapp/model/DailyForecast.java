package com.example.weatherapp.model;

public class DailyForecast {
    private String day; // changed from date
    private int weatherCode;
    private Temperature temperature;
    private double precipitationChance; // new field

    public DailyForecast() {}

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public int getWeatherCode() { return weatherCode; }
    public void setWeatherCode(int weatherCode) { this.weatherCode = weatherCode; }

    public Temperature getTemperature() { return temperature; }
    public void setTemperature(Temperature temperature) { this.temperature = temperature; }

    public double getPrecipitationChance() { return precipitationChance; }
    public void setPrecipitationChance(double precipitationChance) { this.precipitationChance = precipitationChance; }

    public static class Temperature {
        private double max;
        private double min;

        public Temperature() {}

        public double getMax() { return max; }
        public void setMax(double max) { this.max = max; }

        public double getMin() { return min; }
        public void setMin(double min) { this.min = min; }
    }
}
