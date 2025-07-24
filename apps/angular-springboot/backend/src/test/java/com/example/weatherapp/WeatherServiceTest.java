package com.example.weatherapp;

import com.example.weatherapp.model.WeeklyForecastResponse;
import com.example.weatherapp.model.DailyForecast;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.env.Environment;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class WeatherServiceTest {
    @Mock
    private RestTemplate restTemplate;

    @Mock
    private Environment environment;

    @InjectMocks
    private WeatherService weatherService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        weatherService = new WeatherService(restTemplate);
    }

    @Test
    void getWeeklyForecastSuccess() {
        // Mock Open-Meteo API response with 7 days
        String mockApiResponse = "{\"daily\":{\"time\":[\"2025-06-27\",\"2025-06-28\",\"2025-06-29\",\"2025-06-30\",\"2025-07-01\",\"2025-07-02\",\"2025-07-03\"],\"temperature_2m_max\":[25,26,27,28,29,30,31],\"temperature_2m_min\":[15,16,17,18,19,20,21],\"weathercode\":[1,2,3,4,5,6,7]}}";
        when(restTemplate.getForObject(anyString(), eq(String.class))).thenReturn(mockApiResponse);

        WeeklyForecastResponse response = weatherService.getWeeklyForecast(52.52, 13.405, "C");
        assertNotNull(response);
        assertEquals(7, response.getForecast().size());
        DailyForecast day = response.getForecast().get(0);
        assertEquals("2025-06-27", day.getDay());
        assertEquals(25, day.getTemperature().getMax());
        assertEquals(15, day.getTemperature().getMin());
    }
}
