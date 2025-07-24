package com.example.weatherapp.e2e;

import com.intuit.karate.junit5.Karate;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class KarateSpringBootRunner {


    @LocalServerPort
    private int port;

    @BeforeEach
    void beforeEach() {
        System.setProperty("karate.port", String.valueOf(port));
    }

    @Karate.Test
    Karate testAll() {
        return Karate.run("classpath:karate/locations-search.feature",
                          "classpath:karate/weekly-forecast.feature",
                          "classpath:karate/hourly-forecast.feature");
    }
}
