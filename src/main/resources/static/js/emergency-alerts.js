function updateEmergencyAlert(totalRainfall) {
    const risk = document.getElementById("riskValue");
    const description = document.getElementById("riskDescription");
    const guidance = document.getElementById("guidance");

    let level;
    let message;

    if (totalRainfall >= 50) {
        level = "High rainfall";
        message = "Heavy rainfall is forecast. Check official local warnings, avoid waterlogged roads and follow local authority guidance.";
    } else if (totalRainfall >= 20) {
        level = "Moderate rainfall";
        message = "Rainfall may affect local drainage. Monitor weather updates and keep drainage pathways clear where safe.";
    } else if (totalRainfall >= 5) {
        level = "Low rainfall";
        message = "Some rainfall is forecast. Check local conditions and use rainwater collection systems where suitable.";
    } else {
        level = "Very low rainfall";
        message = "Little rainfall is forecast in this period. This does not rule out localised weather hazards.";
    }

    risk.textContent = level;
    description.textContent =
        "Based on forecast rainfall total. This is not an official flood prediction.";

    guidance.textContent = message;
}