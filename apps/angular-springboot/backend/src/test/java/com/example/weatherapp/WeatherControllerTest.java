package com.example.weatherapp;

import com.example.weatherapp.model.WeeklyForecastResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class WeatherControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void weeklyForecastEndpointSuccess() throws Exception {
        mockMvc.perform(get("/api/v1/forecast/week?latitude=52.52&longitude=13.405&unit=C"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void weeklyForecastEndpointMissingParams() throws Exception {
        mockMvc.perform(get("/api/v1/forecast/week"))
                .andExpect(status().isBadRequest());
    }
}
