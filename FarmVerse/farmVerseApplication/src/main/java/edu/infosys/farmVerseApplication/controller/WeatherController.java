package edu.infosys.farmVerseApplication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.infosys.farmVerseApplication.bean.WeatherTelemetry;
import edu.infosys.farmVerseApplication.service.WeatherService;

@RestController
@RequestMapping("/farmverse")
@CrossOrigin(origins = {"http://localhost:3636", "http://localhost:3000"}, allowCredentials = "true")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/weather/{farmId}")
    public WeatherTelemetry getFarmWeather(@PathVariable Long farmId) {
        return weatherService.getFarmWeather(farmId);
    }

    @GetMapping("/weather")
    public WeatherTelemetry getRegionalWeather() {
        return weatherService.getRegionalWeather();
    }
}
