const harvestMap = L.map("harvestMap")
    .setView([19.0760, 72.8777], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(harvestMap);

let selectedHarvestMarker = null;

function selectHarvestLocation(lat, lon) {
    if (selectedHarvestMarker) {
        harvestMap.removeLayer(selectedHarvestMarker);
    }

    selectedHarvestMarker = L.marker([lat, lon])
        .addTo(harvestMap)
        .bindPopup("Selected assessment location")
        .openPopup();

    harvestMap.setView([lat, lon], 13);

    document.getElementById("harvestCoordinates").textContent =
        "Latitude: " + lat.toFixed(5) +
        " | Longitude: " + lon.toFixed(5);

    document.getElementById("harvestStatus").textContent =
        "Location selected. A ground assessment is required before installation.";
}

document.getElementById("harvestLocate").addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Location is not supported by this browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            selectHarvestLocation(
                position.coords.latitude,
                position.coords.longitude
            );
        },
        () => {
            document.getElementById("harvestStatus").textContent =
                "Location permission unavailable. Please enable browser location access.";
        }
    );
});

harvestMap.on("click", event => {
    selectHarvestLocation(
        event.latlng.lat,
        event.latlng.lng
    );
});