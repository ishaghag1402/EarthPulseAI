package com.earthpulse.ai.controller;

import com.earthpulse.ai.model.CommunityReport;
import com.earthpulse.ai.service.AiService;
import com.earthpulse.ai.service.ReportService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final AiService ai;
    private final ReportService reports;

    public ApiController(AiService ai, ReportService reports) {
        this.ai = ai;
        this.reports = reports;
    }

    @PostMapping("/ai/chat")
    public Map<String, Object> chat(@RequestBody Map<String, String> body) {
        String question = body.getOrDefault("prompt", "").trim();

        if (question.isBlank() || question.length() > 3000) {
            return Map.of(
                    "mode", "VALIDATION",
                    "answer", "Please enter a question under 3000 characters."
            );
        }

        return ai.ask(question);
    }

    @PostMapping("/ai/analyze")
    public Map<String, Object> analyze(@RequestBody Map<String, String> body) {
        String area = body.getOrDefault("area", "unspecified area");
        String notes = body.getOrDefault("observations", "No observations supplied");

        String prompt = """
                Prepare a cautious environmental assessment.
                Area: %s
                Observations: %s
                Separate known observations from assumptions.
                List missing data.
                Give practical non-emergency recommendations.
                Do not invent measurements or claim that an area has been inspected.
                """.formatted(area, notes);

        return ai.ask(prompt);
    }

    @GetMapping("/reports/map")
    public List<Map<String, Object>> mapReports() {
        return reports.all().stream()
                .filter(r -> r.getLatitude() != null && r.getLongitude() != null)
                .map(r -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", r.getId());
                    item.put("category", r.getCategory());
                    item.put("status", r.getStatus());
                    item.put("lat", r.getLatitude());
                    item.put("lng", r.getLongitude());
                    return item;
                })
                .toList();
    }

    @PostMapping("/simulator")
    public Map<String, Object> simulate(@RequestBody Map<String, Double> input) {
        double roof = clamp(input.getOrDefault("roofArea", 100.0), 0, 100000);
        double rain = clamp(input.getOrDefault("annualRainMm", 700.0), 0, 5000);
        double efficiency = clamp(input.getOrDefault("efficiency", 0.8), 0, 1);
        double liters = roof * (rain / 1000.0) * efficiency * 1000.0;
        double green = clamp(input.getOrDefault("greenIncrease", 10.0), 0, 100);
        double waste = clamp(input.getOrDefault("wasteReduction", 15.0), 0, 100);

        return Map.of(
                "harvestLitersPerYear", Math.round(liters),
                "greenCoverChangePercent", green,
                "wasteReductionPercent", waste,
                "note", "Illustrative calculation using entered assumptions; not a validated local forecast."
        );
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }
}
