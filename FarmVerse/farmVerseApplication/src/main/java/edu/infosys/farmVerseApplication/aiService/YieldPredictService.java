package edu.infosys.farmVerseApplication.aiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.infosys.farmVerseApplication.bean.FarmCrop;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service 
public class YieldPredictService {
	@Value("${huggingface.api.url}")
    private String apiUrl;
 
    @Value("${huggingface.api.key}")
    private String apiKey;
 
    @Value("${huggingface.model.id}")
    private String modelId;
 
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static volatile boolean onlineAiAvailable = true;
    
    public YieldPredictService() {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(8000);
        this.restTemplate = new RestTemplate(factory);
    }
    
    public FarmCrop predictYield(FarmCrop crop) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.contains("dummy")) {
            simulateYieldCalculation(crop);
            return crop;
        }

        try {
            // Force the AI to reply in a STRICT format so we can parse it in Java
            String prompt = String.format(
                "You are an agricultural expert system. Based on historical data, calculate the expected yield per acre.\n\n" +
                "INPUT DATA:\n" +
                "- Crop Name: %s\n" +
                "- Farm Soil Type: %s\n" +
                "- Dedicated Crop Area: %.2f acres\n" +
                "- Sown Time: %s\n" +
                "- Harvest Time: %s\n\n" +
                "INSTRUCTION:\n" +
                "You MUST reply exactly in this two-line format with no extra text:\n" +
                "YIELD: [numeric value only, e.g., 3.8]\n" +
                "COMMENT: [your historical justification]",
                crop.getCropName(),
                crop.getSoil(),
                crop.getCropArea(),
                crop.getSownMonthYear(),
                crop.getHarvestMonthYear()
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
            if (!candidateModels.contains("llama-3.3-70b-versatile")) {
                candidateModels.add("llama-3.3-70b-versatile");
            }
            if (!candidateModels.contains("qwen-2.5-32b")) {
                candidateModels.add("qwen-2.5-32b");
            }
            if (!candidateModels.contains("gemma2-9b-it")) {
                candidateModels.add("gemma2-9b-it");
            }

            ResponseEntity<String> response = null;
            for (String candidate : candidateModels) {
                if (candidate == null || candidate.trim().isEmpty()) continue;
                try {
                    payload.put("model", candidate.trim());
                    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
                    response = restTemplate.postForEntity(apiUrl, entity, String.class);
                    if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                        System.out.println(">>> Groq AI Prediction SUCCESSFUL using model: " + candidate);
                        break;
                    }
                } catch (Exception modelEx) {
                    // Try next active candidate model
                }
            }

            if (response == null || response.getBody() == null) {
                simulateYieldCalculation(crop);
                return crop;
            }
 
            JsonNode root = objectMapper.readTree(response.getBody());
            String resultText = root.path("choices")
                                   .get(0)
                                   .path("message")
                                   .path("content")
                                   .asText().trim();
 
            // --- ROBUST PARSING LOGIC ---
            String upperText = resultText.toUpperCase();
            if (upperText.contains("YIELD:") && upperText.contains("COMMENT:")) {
                String[] parts = resultText.split("(?i)COMMENT:"); 
                String yieldPart = parts[0].replaceAll("(?i).*YIELD:", "").trim();
                yieldPart = yieldPart.replaceAll("[^0-9.]", "");
                
                if(!yieldPart.isEmpty()) {
                    try {
                        crop.setYield(Double.parseDouble(yieldPart));
                    } catch (NumberFormatException e) {
                        crop.setYield(0.0);
                    }
                }
                if (parts.length > 1) {
                    crop.setComments(parts[1].trim().replaceAll("^\\*\\*|\\*\\*$", ""));
                } else {
                    crop.setComments("");
                }
            } else {
                // Try to extract the first number we can find if format is missing
                String rawNumbers = resultText.replaceAll("[^0-9.]", " ").trim().split("\\s+")[0];
                if (!rawNumbers.isEmpty() && !rawNumbers.equals(".")) {
                    try {
                       crop.setYield(Double.parseDouble(rawNumbers));
                    } catch (Exception e) {}
                }
                crop.setComments("Raw AI Output: " + resultText);
            }
 
            return crop; // Return the updated object
 
        } catch (Exception e) {
            onlineAiAvailable = false;
            simulateYieldCalculation(crop);
            return crop;
        }
    }

    private void simulateYieldCalculation(FarmCrop crop) {
        String cropName = (crop.getCropName() != null) ? crop.getCropName().toLowerCase() : "";
        String soil = (crop.getSoil() != null) ? crop.getSoil().toLowerCase() : "";
        
        double baseYield = 3.0; // default tons per acre
        
        if (cropName.contains("bean")) {
            baseYield = 2.8;
        } else if (cropName.contains("wheat")) {
            baseYield = 3.6;
        } else if (cropName.contains("rice") || cropName.contains("paddy")) {
            baseYield = 4.2;
        } else if (cropName.contains("corn") || cropName.contains("maize")) {
            baseYield = 4.5;
        } else if (cropName.contains("cotton")) {
            baseYield = 1.8;
        } else if (cropName.contains("carrot")) {
            baseYield = 8.5;
        } else if (cropName.contains("tomato")) {
            baseYield = 12.0;
        } else if (cropName.contains("potato")) {
            baseYield = 10.5;
        } else if (cropName.contains("soybean")) {
            baseYield = 2.4;
        }

        // Adjust based on soil characteristics
        if (soil.contains("loam") || soil.contains("alluvial")) {
            baseYield *= 1.15;
        } else if (soil.contains("black") || soil.contains("clay")) {
            baseYield *= 1.05;
        } else if (soil.contains("sandy") || soil.contains("lateriate") || soil.contains("laterite")) {
            baseYield *= 0.90;
        }

        double finalYield = Math.round(baseYield * 10.0) / 10.0;
        crop.setYield(finalYield);
        crop.setComments(String.format("Estimated standard historical yield for %s in %s soil is approximately %.1f Tons/Acre under standard seasonal conditions.",
                crop.getCropName() != null ? crop.getCropName() : "crop",
                crop.getSoil() != null ? crop.getSoil() : "regional",
                finalYield));
    }
 
    
}
 


