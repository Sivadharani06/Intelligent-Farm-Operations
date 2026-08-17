package edu.infosys.farmVerseApplication.aiService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.stereotype.Service;

import edu.infosys.farmVerseApplication.bean.FarmCropInputs;

@Service
public class ExpensePredictService {
	
	@Value("${huggingface.api.url}")
    private String apiUrl;
 
    @Value("${huggingface.api.key}")
    private String apiKey;
 
    @Value("${huggingface.model.id}")
    private String modelId;
 
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public FarmCropInputs predictResourceExpenses(FarmCropInputs cropInputs) {
        try {
            // Treat yield as a regular input property alongside cropId, cropName, etc.
            String prompt = String.format(
                "You are an agricultural expert system. Based on historical data and crop management standards, " +
                "calculate the required resources per acre for the provided crop data.\n\n" +
                "INPUT DATA:\n" +
                "- Crop ID: %s\n" +
                "- Crop Name: %s\n" +
                "- Soil Type: %s\n" +
                "- Sown Time: %s\n" +
                "- Harvest Time: %s\n" +
                "- Yield per Acre: %.2f\n\n" +
                "INSTRUCTION:\n" +
                "Based on these parameters, calculate typical per-acre resource requirements. " +
                "Reply STRICTLY in this four-line key-value format (numeric values only):\n" +
                "WATER_GALLON: [numeric value for gallons per acre]\n" +
                "FERTILIZER_KG: [numeric value for kg per acre]\n" +
                "PESTICIDE_KG: [numeric value for kg per acre]\n" +
                "TRACTOR_HOUR: [integer value for hours per acre]",
                cropInputs.getCropId(),
                cropInputs.getCropName(),
                cropInputs.getSoil(),
                cropInputs.getSownMonthYear(),
                cropInputs.getHarvestMonthYear(),
                cropInputs.getYield() != null ? cropInputs.getYield() : 0.0
            );
 
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
 
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", modelId);
 
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", prompt));
 
            payload.put("messages", messages);
            payload.put("max_tokens", 300);
 
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
 
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
 
            // Parse response: choices[0].message.content
            JsonNode root = objectMapper.readTree(response.getBody());
            String resultText = root.path("choices")
                                   .get(0)
                                   .path("message")
                                   .path("content")
                                   .asText().trim();
 
            // Populate resource prediction fields into the cropInputs object
            parseAndSetPredictedValues(resultText, cropInputs);
 
            return cropInputs;
 
        } catch (Exception e) {
            System.err.println("Error predicting resource expenses: " + e.getMessage());
            simulateResourceCalculation(cropInputs);
            return cropInputs;
        }
    }
    
    private void simulateResourceCalculation(FarmCropInputs cropInputs) {
        String name = (cropInputs.getCropName() != null) ? cropInputs.getCropName().toLowerCase() : "";
        
        // Base per-acre defaults
        double water = 4000;
        double fertilizer = 50;
        double pesticide = 5;
        int tractor = 10;
        
        if (name.contains("carrot")) {
            water = 3500; fertilizer = 40; pesticide = 4; tractor = 8;
        } else if (name.contains("wheat")) {
            water = 5500; fertilizer = 60; pesticide = 6; tractor = 12;
        } else if (name.contains("corn") || name.contains("maize")) {
            water = 6000; fertilizer = 70; pesticide = 7; tractor = 14;
        } else if (name.contains("rice")) {
            water = 10000; fertilizer = 80; pesticide = 5; tractor = 15;
        } else if (name.contains("cotton")) {
            water = 7000; fertilizer = 65; pesticide = 8; tractor = 11;
        } else if (name.contains("soybean")) {
            water = 4500; fertilizer = 45; pesticide = 5; tractor = 9;
        }
        
        cropInputs.setWaterGallon(water);
        cropInputs.setFertilizer(fertilizer);
        cropInputs.setPesticides(pesticide);
        cropInputs.setTractorHour(tractor);
    }
    
    private void parseAndSetPredictedValues(String rawResponse, FarmCropInputs cropInputs) {
        String[] lines = rawResponse.split("\n");
 
        for (String line : lines) {
            String cleanLine = line.trim().toUpperCase();
 
            if (cleanLine.contains("WATER_GALLON:")) {
                String val = cleanLine.replaceAll("(?i).*WATER_GALLON:", "").replaceAll("[^0-9.]", "").trim();
                if (!val.isEmpty()) cropInputs.setWaterGallon(Double.parseDouble(val));
            } else if (cleanLine.contains("FERTILIZER_KG:")) {
                String val = cleanLine.replaceAll("(?i).*FERTILIZER_KG:", "").replaceAll("[^0-9.]", "").trim();
                if (!val.isEmpty()) cropInputs.setFertilizer(Double.parseDouble(val));
            } else if (cleanLine.contains("PESTICIDE_KG:")) {
                String val = cleanLine.replaceAll("(?i).*PESTICIDE_KG:", "").replaceAll("[^0-9.]", "").trim();
                if (!val.isEmpty()) cropInputs.setPesticides(Double.parseDouble(val));
            } else if (cleanLine.contains("TRACTOR_HOUR:")) {
                String val = cleanLine.replaceAll("(?i).*TRACTOR_HOUR:", "").replaceAll("[^0-9]", "").trim();
                if (!val.isEmpty()) cropInputs.setTractorHour(Integer.parseInt(val));
            }
        }
    }
 
    
    
 

}
