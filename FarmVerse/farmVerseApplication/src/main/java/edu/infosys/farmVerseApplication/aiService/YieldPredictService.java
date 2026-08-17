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
 
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    
    
    public FarmCrop predictYield(FarmCrop crop) {
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
            headers.setBearerAuth(apiKey);
 
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", modelId);
 
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", prompt));
            
            payload.put("messages", messages);
            payload.put("max_tokens", 300);
 
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
 
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
 
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
            crop.setComments("Error predicting yield: " + e.getMessage());
            return crop;
        }
    }
 
    
}
 


