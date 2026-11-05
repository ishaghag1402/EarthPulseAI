const rainMap = L.map("rainMap").setView([19.0760, 72.8777], 8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(rainMap);

let selectedMarker = null;
let rainCircle = null;

const latInput = document.getElementById("latitude");
const lonInput = document.getElementById("longitude");

function showLocation(lat, lon) {
    latInput.value = lat.toFixed(5);
    lonInput.value = lon.toFixed(5);

    rainMap.setView([lat, lon], 10);

    if (selectedMarker) rainMap.removeLayer(selectedMarker);

    selectedMarker = L.marker([lat, lon])
        .addTo(rainMap)
        .bindPopup("Selected location")
        .openPopup();

    loadRainfall(lat, lon);
}

document.getElementById("locateButton").addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            showLocation(
                position.coords.latitude,
                position.coords.longitude
            );
            document.getElementById("locationStatus").textContent =
                "Your location was shared successfully.";
        },
        () => {
            document.getElementById("locationStatus").textContent =
                "Location permission denied or unavailable. Enter coordinates manually.";
        }
    );
});

document.getElementById("loadRain").addEventListener("click", () => {
    const lat = Number(latInput.value);
    const lon = Number(lonInput.value);

    if (!Number.isFinite(lat) || !Number.isFinite(lon) ||
        lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        alert("Please enter valid latitude and longitude.");
        return;
    }

    showLocation(lat, lon);
});

async function loadRainfall(lat, lon) {
    document.getElementById("rainValue").textContent = "Loading...";
    document.getElementById("riskValue").textContent = "Loading...";

    try {
        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}` +
            `&longitude=${lon}&hourly=precipitation&forecast_days=2&timezone=auto`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather service unavailable");

        const data = await response.json();
        const values = data.hourly.precipitation.slice(0, 12);

        const total = values.reduce((sum, value) => sum + value, 0);

        document.getElementById("rainValue").textContent =
            total.toFixed(1) + " mm";

        document.getElementById("rainPeriod").textContent =
            "Forecast total for the next 12 hours";

        if (rainCircle) rainMap.removeLayer(rainCircle);

        const color = total >= 50 ? "#e45b49" :
                      total >= 20 ? "#e8ae42" :
                      total >= 5 ? "#65a98b" : "#5b9dd0";

        rainCircle = L.circle([lat, lon], {
            radius: 12000,
            color: color,
            fillColor: color,
            fillOpacity: 0.35
        }).addTo(rainMap);

        updateEmergencyAlert(total);

    } catch (error) {
        document.getElementById("rainValue").textContent = "Unavailable";
        document.getElementById("riskValue").textContent = "Unavailable";
        document.getElementById("riskDescription").textContent =
            "Could not retrieve forecast data. Please try again later.";
        document.getElementById("guidance").textContent =
            "Use official local weather alerts for safety decisions.";
    }
}