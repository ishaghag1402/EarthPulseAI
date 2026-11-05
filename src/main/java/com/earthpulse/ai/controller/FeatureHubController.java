package com.earthpulse.ai.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FeatureHubController {
    @GetMapping("/features") public String features() { return "features"; }
    @GetMapping("/waste-report") public String wasteReport() { return "waste-report"; }
    @GetMapping("/rainfall-map") public String rainfall() { return "rainfall-map"; }
    @GetMapping("/harvesting-map") public String harvesting() { return "harvesting-map"; }
    @GetMapping("/rainfall-risk") public String rainfallRisk() { return "alerts"; }
    @GetMapping("/environmental-insights") public String environmentalInsights() { return "analytics"; }
    @GetMapping("/carbon-footprint") public String carbonFootprint() { return "carbon-footprint"; }
    @GetMapping("/eco-twin") public String ecoTwin() { return "eco-twin"; }
    @GetMapping("/climate-risk") public String climateRisk() { return "climate-risk"; }
    @GetMapping("/green-cover") public String greenCover() { return "green-cover"; }
    @GetMapping("/water-intelligence") public String waterIntelligence() { return "water-intelligence"; }
    @GetMapping("/eco-scenario") public String ecoScenario() { return "eco-scenario"; }
    @GetMapping("/biodiversity") public String biodiversity() { return "biodiversity"; }
    @GetMapping("/pollution-heatmap") public String pollutionHeatmap() { return "pollution-heatmap"; }
    @GetMapping("/deforestation-tracker") public String deforestationTracker() { return "deforestation-tracker"; }
    @GetMapping("/flood-early-warning") public String floodEarlyWarning() { return "flood-early-warning"; }
    @GetMapping("/water-quality") public String waterQuality() { return "water-quality"; }
    @GetMapping("/biodiversity-explorer") public String biodiversityExplorer() { return "biodiversity-explorer"; }
    @GetMapping("/renewable-energy") public String renewableEnergy() { return "renewable-energy"; }
    @GetMapping("/green-score") public String greenScore() { return "green-score"; }
    @GetMapping("/community-map") public String communityMap() { return "community-map"; }
    @GetMapping("/command-center") public String commandCenter() { return "command-center"; }
}
