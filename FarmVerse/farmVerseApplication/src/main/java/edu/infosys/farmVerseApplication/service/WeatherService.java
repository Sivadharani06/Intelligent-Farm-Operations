package edu.infosys.farmVerseApplication.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.infosys.farmVerseApplication.bean.Crop;
import edu.infosys.farmVerseApplication.bean.DailyForecast;
import edu.infosys.farmVerseApplication.bean.Farm;
import edu.infosys.farmVerseApplication.bean.WeatherTelemetry;
import edu.infosys.farmVerseApplication.dao.CropDao;
import edu.infosys.farmVerseApplication.dao.FarmDao;

@Service
public class WeatherService {

    @Autowired
    private FarmDao farmDao;

    @Autowired
    private CropDao cropDao;

    @Autowired
    private FarmUserService userService;

    private final Random random = new Random();

    public WeatherTelemetry getFarmWeather(Long farmId) {
        Farm farm = null;
        if (farmId != null) {
            try {
                farm = farmDao.getFarmById(farmId);
            } catch (Exception e) {
                farm = null;
            }
        }

        if (farm == null) {
            return getRegionalWeather();
        }

        String soil = (farm.getSoil() != null && !farm.getSoil().trim().isEmpty())
                ? farm.getSoil().trim()
                : "Alluvial";
        String farmName = farm.getFarmName() != null ? farm.getFarmName() : "Plot #" + farm.getFarmId();

        // Check crops associated with this farm
        List<String> associatedCrops = new ArrayList<>();
        try {
            String username = userService.getUserId();
            List<Crop> userCrops = cropDao.getCropsByUsername(username);
            if (userCrops != null) {
                for (Crop c : userCrops) {
                    if (c.getFarmId() != null && c.getFarmId().equals(farm.getFarmId())) {
                        if (c.getCropName() != null && !c.getCropName().trim().isEmpty()) {
                            associatedCrops.add(c.getCropName().trim());
                        }
                    }
                }
            }
        } catch (Exception ignored) {
        }

        return generateDynamicTelemetry(farm.getFarmId(), farmName, soil, associatedCrops);
    }

    public WeatherTelemetry getRegionalWeather() {
        return generateDynamicTelemetry(null, "Regional Agro-Station", "Alluvial", new ArrayList<>());
    }

    private WeatherTelemetry generateDynamicTelemetry(Long farmId, String farmName, String soil, List<String> crops) {
        String soilLower = soil.toLowerCase();

        int baseTemp;
        int soilMoisture;
        String soilStatus;
        int humidity;
        int rainProb;
        int windSpeed;
        String uvRating;
        int barometer = 1010 + random.nextInt(5); // 1010 - 1014 hPa

        String condition;
        String conditionIcon;
        String advisory;

        LocalDate today = LocalDate.now();
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("EEE, MMM d");

        // Soil microclimate telemetry simulation
        if (soilLower.contains("clay")) {
            baseTemp = 28 + random.nextInt(3);
            soilMoisture = 76 + random.nextInt(8); // 76 - 83%
            soilStatus = "High Retention (Clay Matrix)";
            humidity = 72 + random.nextInt(8);
            rainProb = 25 + random.nextInt(20);
            windSpeed = 12 + random.nextInt(6);
            uvRating = "5.6 (Moderate)";
            condition = rainProb > 35 ? "Scattered Showers" : "Partly Cloudy";
            conditionIcon = rainProb > 35 ? "🌦️" : "⛅";

            advisory = String.format(
                "Clay soil at '%s' has elevated moisture retention (%d%%). Field infiltration is slower. " +
                "Action: Ensure open drainage furrows before showers. Avoid running heavy machinery to prevent soil compaction.",
                farmName, soilMoisture
            );
        } else if (soilLower.contains("black") || soilLower.contains("cotton")) {
            baseTemp = 30 + random.nextInt(3);
            soilMoisture = 66 + random.nextInt(7); // 66 - 72%
            soilStatus = "Optimal Sub-Moisture";
            humidity = 64 + random.nextInt(7);
            rainProb = 15 + random.nextInt(15);
            windSpeed = 11 + random.nextInt(5);
            uvRating = "6.9 (High)";
            condition = "Sunny & Warm";
            conditionIcon = "☀️";

            advisory = String.format(
                "High thermal retention in Black Soil at '%s'. Soil moisture holds at %d%%. " +
                "Action: Schedule early morning drip irrigation to prevent surface fissuring and maintain root respiration.",
                farmName, soilMoisture
            );
        } else if (soilLower.contains("sand") || soilLower.contains("red")) {
            baseTemp = 31 + random.nextInt(3);
            soilMoisture = 52 + random.nextInt(9); // 52 - 60%
            soilStatus = "Rapid Drainage - Watch Deficit";
            humidity = 58 + random.nextInt(8);
            rainProb = 10 + random.nextInt(15);
            windSpeed = 15 + random.nextInt(6);
            uvRating = "7.2 (Very High)";
            condition = "Clear Skies & Breezy";
            conditionIcon = "🌤️";

            advisory = String.format(
                "Porous soil profile at '%s' with %d%% moisture. Rapid percolation observed. " +
                "Action: Maintain consistent light fertigation cycles and check drip emitters to mitigate moisture stress.",
                farmName, soilMoisture
            );
        } else {
            // Alluvial / Loam / Default
            baseTemp = 29 + random.nextInt(3);
            soilMoisture = 70 + random.nextInt(6); // 70 - 75%
            soilStatus = "Optimal Root Zone";
            humidity = 68 + random.nextInt(7);
            rainProb = 20 + random.nextInt(15);
            windSpeed = 14 + random.nextInt(5);
            uvRating = "5.2 (Moderate)";
            condition = "Partly Cloudy";
            conditionIcon = "⛅";

            advisory = String.format(
                "Optimal vegetative equilibrium at '%s'. Soil moisture at %d%% with 1012 hPa pressure. " +
                "Action: Favorable conditions for weeding, foliar micronutrient spraying, and scheduled field scouting.",
                farmName, soilMoisture
            );
        }

        // Incorporate crop context into advisory if available
        if (!crops.isEmpty()) {
            advisory += " Current cultivated crops: " + String.join(", ", crops) + ".";
        }

        int feelsLike = baseTemp + (humidity > 70 ? 2 : 1);

        // 3-Day dynamic precision forecast
        List<DailyForecast> forecast = new ArrayList<>();

        // Day 1 (Today)
        forecast.add(new DailyForecast(
            "Today",
            conditionIcon,
            baseTemp,
            baseTemp - 7,
            rainProb + "%",
            rainProb > 30 ? "Hold pesticide spray & monitor runoff" : "Ideal for weeding & top-dressing"
        ));

        // Day 2 (Tomorrow)
        int day2Rain = Math.max(10, (rainProb + 15 + random.nextInt(20)) % 85);
        String day2Icon = day2Rain > 50 ? "🌧️" : (day2Rain > 25 ? "🌦️" : "🌤️");
        forecast.add(new DailyForecast(
            "Tomorrow",
            day2Icon,
            baseTemp - (day2Rain > 50 ? 2 : 0),
            baseTemp - 8,
            day2Rain + "%",
            day2Rain > 50 ? "Heavy precipitation alert - pause irrigation" : "Favorable window for field canopy inspection"
        ));

        // Day 3 (Day after tomorrow)
        LocalDate day3Date = today.plusDays(2);
        String day3Label = day3Date.format(dayFormatter);
        int day3Rain = Math.max(10, random.nextInt(35));
        String day3Icon = day3Rain > 25 ? "🌦️" : "☀️";
        forecast.add(new DailyForecast(
            day3Label,
            day3Icon,
            baseTemp + 1,
            baseTemp - 6,
            day3Rain + "%",
            "Optimal for grain drying & harvesting tasks"
        ));

        return new WeatherTelemetry(
            farmId,
            farmName,
            soil,
            baseTemp,
            feelsLike,
            condition,
            conditionIcon,
            humidity,
            rainProb,
            windSpeed,
            soilMoisture,
            soilStatus,
            uvRating,
            barometer,
            advisory,
            forecast
        );
    }
}
