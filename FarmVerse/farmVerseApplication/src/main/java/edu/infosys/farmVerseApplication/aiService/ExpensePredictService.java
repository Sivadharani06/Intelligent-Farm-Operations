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
 
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public ExpensePredictService() {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(8000);
        this.restTemplate = new RestTemplate(factory);
    }
    
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
                "TRACTOR_HOUR: [numeric value for hours per acre]",
                cropInputs.getCropId(),
                cropInputs.getCropName(),
                cropInputs.getSoil(),
                cropInputs.getSownMonthYear(),
                cropInputs.getHarvestMonthYear(),
                cropInputs.getYield() != null ? cropInputs.getYield() : 0.0
            );
 
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey.trim());
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) FarmVerse/1.0");

            Map<String, Object> payload = new HashMap<>();
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", prompt));
            payload.put("messages", messages);
            payload.put("max_tokens", 300);

            // Use verified active chat completion models on Groq
            List<String> candidateModels = new ArrayList<>();
            if (modelId != null && !modelId.trim().isEmpty()) {
                candidateModels.add(modelId.trim());
            }
            if (!candidateModels.contains("llama-3.1-8b-instant")) {
                candidateModels.add("llama-3.1-8b-instant");
            }
            if (!candidateModels.contains("llama-3.3-70b-versatile")) {
                candidateModels.add("llama-3.3-70b-versatile");
            }

            ResponseEntity<String> response = null;
            for (String candidate : candidateModels) {
                if (candidate == null || candidate.trim().isEmpty()) continue;
                try {
                    payload.put("model", candidate.trim());
                    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
                    response = restTemplate.postForEntity(apiUrl, entity, String.class);
                    if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                        System.out.println(">>> Groq AI Expense Prediction successful using model: " + candidate);
                        break;
                    }
                } catch (Exception modelEx) {
                    System.err.println("Notice: Model " + candidate + " unavailable (" + modelEx.getMessage() + ")");
                    // If network host is unreachable or handshake terminated, don't stall further
                    String msg = String.valueOf(modelEx.getMessage()).toLowerCase();
                    if (msg.contains("remote host terminated") || msg.contains("unknownhost") || msg.contains("refused") || msg.contains("timed out")) {
                        break;
                    }
                }
            }

            if (response == null || response.getBody() == null) {
                throw new RuntimeException("Groq AI online endpoint unreachable or models unavailable.");
            }
 
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
            System.err.println("AI prediction bypassed or offline (" + e.getMessage() + "). Applying smart calculation simulation.");
            simulateResourceCalculation(cropInputs);
            return cropInputs;
        }
    }
    
    private void simulateResourceCalculation(FarmCropInputs cropInputs) {
        String name = (cropInputs.getCropName() != null) ? cropInputs.getCropName().toLowerCase() : "";
        String soil = (cropInputs.getSoil() != null) ? cropInputs.getSoil().toLowerCase() : "";
        
        // Base per-acre defaults
        double water = 4000.0;
        double fertilizer = 55.0;
        double pesticide = 5.0;
        double tractor = 10.0;
        
        if (name.contains("tomat")) {
            water = 4800.0; fertilizer = 65.0; pesticide = 6.0; tractor = 12.0;
        } else if (name.contains("potato")) {
            water = 4200.0; fertilizer = 70.0; pesticide = 6.5; tractor = 14.0;
        } else if (name.contains("carrot")) {
            water = 3500.0; fertilizer = 40.0; pesticide = 4.0; tractor = 8.0;
        } else if (name.contains("wheat")) {
            water = 5500.0; fertilizer = 60.0; pesticide = 6.0; tractor = 12.0;
        } else if (name.contains("corn") || name.contains("maize")) {
            water = 6000.0; fertilizer = 70.0; pesticide = 7.0; tractor = 14.0;
        } else if (name.contains("rice") || name.contains("paddy")) {
            water = 10000.0; fertilizer = 80.0; pesticide = 5.0; tractor = 15.0;
        } else if (name.contains("cotton")) {
            water = 7000.0; fertilizer = 65.0; pesticide = 8.0; tractor = 11.0;
        } else if (name.contains("soybean") || name.contains("bean")) {
            water = 4500.0; fertilizer = 45.0; pesticide = 5.0; tractor = 9.0;
        } else if (name.contains("sugarcane")) {
            water = 12000.0; fertilizer = 90.0; pesticide = 9.0; tractor = 18.0;
        }
        
        // Adjust slightly by soil type
        if (soil.contains("sandy")) {
            water *= 1.15; // sandy needs more irrigation
        } else if (soil.contains("clay")) {
            water *= 0.90; // retains more water
            tractor *= 1.10; // heavier soil requires more tillage
        }
        
        cropInputs.setWaterGallon(Math.round(water * 10.0) / 10.0);
        cropInputs.setFertilizer(Math.round(fertilizer * 10.0) / 10.0);
        cropInputs.setPesticides(Math.round(pesticide * 10.0) / 10.0);
        cropInputs.setTractorHour(Math.round(tractor * 10.0) / 10.0);
    }
    
    private void parseAndSetPredictedValues(String rawResponse, FarmCropInputs cropInputs) {
        String[] lines = rawResponse.split("\n");

        for (String line : lines) {
            // Strip markdown formatting like **, *, #, backticks
            String clean = line.replaceAll("[\\*#`_]", " ").trim();
            String upper = clean.toUpperCase();

            if (upper.contains("WATER") && (upper.contains("GALLON") || upper.contains(":"))) {
                extractFirstNumber(clean).ifPresent(cropInputs::setWaterGallon);
            } else if (upper.contains("FERTILIZER") && (upper.contains("KG") || upper.contains(":"))) {
                extractFirstNumber(clean).ifPresent(cropInputs::setFertilizer);
            } else if (upper.contains("PESTICIDE") && (upper.contains("KG") || upper.contains(":"))) {
                extractFirstNumber(clean).ifPresent(cropInputs::setPesticides);
            } else if (upper.contains("TRACTOR") && (upper.contains("HOUR") || upper.contains(":"))) {
                extractFirstNumber(clean).ifPresent(cropInputs::setTractorHour);
            }
        }

        // Safety fallback: if any value was not properly extracted or remained 0, fill with calculated values
        if (cropInputs.getWaterGallon() == null || cropInputs.getWaterGallon() <= 0.0 ||
            cropInputs.getFertilizer() == null || cropInputs.getFertilizer() <= 0.0 ||
            cropInputs.getPesticides() == null || cropInputs.getPesticides() <= 0.0 ||
            cropInputs.getTractorHour() == null || cropInputs.getTractorHour() <= 0.0) {
            
            FarmCropInputs fallback = new FarmCropInputs();
            fallback.setCropName(cropInputs.getCropName());
            fallback.setSoil(cropInputs.getSoil());
            simulateResourceCalculation(fallback);
            
            if (cropInputs.getWaterGallon() == null || cropInputs.getWaterGallon() <= 0.0) {
                cropInputs.setWaterGallon(fallback.getWaterGallon());
            }
            if (cropInputs.getFertilizer() == null || cropInputs.getFertilizer() <= 0.0) {
                cropInputs.setFertilizer(fallback.getFertilizer());
            }
            if (cropInputs.getPesticides() == null || cropInputs.getPesticides() <= 0.0) {
                cropInputs.setPesticides(fallback.getPesticides());
            }
            if (cropInputs.getTractorHour() == null || cropInputs.getTractorHour() <= 0.0) {
                cropInputs.setTractorHour(fallback.getTractorHour());
            }
        }
    }

    private java.util.Optional<Double> extractFirstNumber(String text) {
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("([0-9]+(?:\\.[0-9]+)?)").matcher(text);
        if (m.find()) {
            try {
                return java.util.Optional.of(Double.parseDouble(m.group(1)));
            } catch (Exception ignored) {}
        }
        return java.util.Optional.empty();
    }
 
    
    
 

}
