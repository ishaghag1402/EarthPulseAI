document.addEventListener("DOMContentLoaded", function () {



    // =====================================
    // 2. RAINFALL MAP
    // =====================================

    const rainMapElement =
        document.getElementById("dashboardRainMap");

    let rainMap = null;
    let rainMarker = null;
    let rainLayers = [];

    if (rainMapElement && typeof L !== "undefined") {

        rainMap = L.map("dashboardRainMap")
            .setView([19.0760, 72.8777], 8);

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: "&copy; OpenStreetMap contributors"
            }
        ).addTo(rainMap);
    }


    const latField = document.getElementById("epLatitude");
    const lonField = document.getElementById("epLongitude");

    function showSelectedLocation(lat, lon) {

        latField.value = lat.toFixed(5);
        lonField.value = lon.toFixed(5);

        rainMap.setView([lat, lon], 9);

        if (rainMarker) {
            rainMap.removeLayer(rainMarker);
        }

        rainMarker = L.marker([lat, lon])
            .addTo(rainMap)
            .bindPopup("Your selected location")
            .openPopup();

        document.getElementById("epLocationStatus").textContent =
            "Selected location: " + lat.toFixed(4) +
            ", " + lon.toFixed(4);

        loadRainfall(lat, lon);
    }


    document.getElementById("epLocateButton")
        .addEventListener("click", function () {

            if (!navigator.geolocation) {
                alert("Location is not supported by this browser.");
                return;
            }

            navigator.geolocation.getCurrentPosition(

                function (position) {
                    showSelectedLocation(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                },

                function () {
                    document.getElementById("epLocationStatus")
                        .textContent =
                        "Location permission denied. Enter coordinates manually.";
                }
            );
        });


    document.getElementById("epCheckRain")
        .addEventListener("click", function () {

            const lat = Number(latField.value);
            const lon = Number(lonField.value);

            if (
                !Number.isFinite(lat) ||
                !Number.isFinite(lon) ||
                lat < -90 || lat > 90 ||
                lon < -180 || lon > 180
            ) {
                alert("Please enter valid latitude and longitude.");
                return;
            }

            showSelectedLocation(lat, lon);
        });


    async function getWeather(lat, lon) {

        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${lat}` +
            `&longitude=${lon}` +
            `&current=temperature_2m,wind_speed_10m` +
            `&hourly=precipitation` +
            `&forecast_days=2&timezone=auto`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Weather data unavailable");
        }

        return response.json();
    }


    async function loadRainfall(lat, lon) {

        document.getElementById("epRainValue").textContent = "Loading...";
        document.getElementById("epRiskLevel").textContent = "Checking...";

        try {

            const data = await getWeather(lat, lon);

            const rainfall = data.hourly.precipitation
                .slice(0, 12);

            const total = rainfall.reduce(
                (sum, value) => sum + Number(value || 0), 0
            );

            const temperature =
                data.current.temperature_2m;

            const wind =
                data.current.wind_speed_10m;

            document.getElementById("epRainValue").textContent =
                total.toFixed(1) + " mm";

            document.getElementById("epTemperature").textContent =
                temperature + " °C";

            document.getElementById("epWind").textContent =
                wind + " km/h";

            document.getElementById("epInsightRain").textContent =
                total.toFixed(1) + " mm";

            document.getElementById("epInsightTemp").textContent =
                temperature + " °C";

            document.getElementById("epInsightWind").textContent =
                wind + " km/h";

            updateRainRisk(total);

            // Clear old forecast circles
            rainLayers.forEach(layer => rainMap.removeLayer(layer));
            rainLayers = [];

            // Sample a 3 x 3 grid around selected location.
            // Each point is a forecast sample, not an actual radar pixel.

            const offsets = [
                [-0.15, -0.15], [-0.15, 0], [-0.15, 0.15],
                [0, -0.15], [0, 0], [0, 0.15],
                [0.15, -0.15], [0.15, 0], [0.15, 0.15]
            ];

            const samples = await Promise.all(
                offsets.map(async ([dLat, dLon]) => {

                    const sampleLat = Math.max(
                        -90, Math.min(90, lat + dLat)
                    );

                    const sampleLon = Math.max(
                        -180, Math.min(180, lon + dLon)
                    );

                    try {
                        const sample = await getWeather(
                            sampleLat, sampleLon
                        );

                        const amount = sample.hourly.precipitation
                            .slice(0, 12)
                            .reduce(
                                (sum, value) =>
                                    sum + Number(value || 0), 0
                            );

                        return {
                            lat: sampleLat,
                            lon: sampleLon,
                            amount
                        };

                    } catch (error) {
                        return null;
                    }
                })
            );

            samples.filter(Boolean).forEach(point => {

                let color;

                if (point.amount >= 50) {
                    color = "#dc5149";
                } else if (point.amount >= 20) {
                    color = "#e9ae43";
                } else if (point.amount >= 5) {
                    color = "#65a982";
                } else {
                    color = "#69a9d2";
                }

                const circle = L.circle(
                    [point.lat, point.lon],
                    {
                        radius: 6500,
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.42,
                        weight: 1
                    }
                ).addTo(rainMap);

                circle.bindPopup(
                    "Forecast rainfall: " +
                    point.amount.toFixed(1) + " mm / 12 hours"
                );

                rainLayers.push(circle);
            });

        } catch (error) {

            document.getElementById("epRainValue").textContent =
                "Unavailable";

            document.getElementById("epRiskLevel").textContent =
                "Data unavailable";

            document.getElementById("epRiskMessage").textContent =
                "Could not retrieve forecast data. Please try again later.";

        }
    }


    // =====================================
    // 3. RAINFALL INDICATOR
    // =====================================

    function updateRainRisk(total) {

        const level =
            document.getElementById("epRiskLevel");

        const message =
            document.getElementById("epRiskMessage");

        if (total >= 50) {

            level.textContent = "High rainfall estimate";

            message.textContent =
                "Heavy rainfall is forecast for this period. " +
                "Check official local alerts, avoid waterlogged roads " +
                "and follow local authority guidance.";

        } else if (total >= 20) {

            level.textContent = "Moderate rainfall estimate";

            message.textContent =
                "Rainfall may affect local drainage. " +
                "Monitor official weather updates.";

        } else if (total >= 5) {

            level.textContent = "Low rainfall estimate";

            message.textContent =
                "Some rainfall is forecast. Consider suitable rainwater " +
                "collection and check local conditions.";

        } else {

            level.textContent = "Very low rainfall estimate";

            message.textContent =
                "Little rainfall is forecast during this period. " +
                "This does not rule out local weather hazards.";
        }
    }


    // =====================================
    // 4. RAINWATER HARVESTING MAP
    // =====================================

    const harvestElement =
        document.getElementById("dashboardHarvestMap");

    if (harvestElement && typeof L !== "undefined") {

        const harvestMap = L.map("dashboardHarvestMap")
            .setView([19.0760, 72.8777], 9);

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: "&copy; OpenStreetMap contributors"
            }
        ).addTo(harvestMap);

        let harvestMarker = null;

        harvestMap.on("click", function (event) {

            const lat = event.latlng.lat;
            const lon = event.latlng.lng;

            if (harvestMarker) {
                harvestMap.removeLayer(harvestMarker);
            }

            harvestMarker = L.marker([lat, lon])
                .addTo(harvestMap)
                .bindPopup("Selected assessment point")
                .openPopup();

            document.getElementById("epHarvestLocation")
                .textContent =
                "Latitude: " + lat.toFixed(5) +
                " | Longitude: " + lon.toFixed(5) +
                ". Site suitability has not been verified.";
        });
    }


    // =====================================
    // 5. EARTHPULSE CHAT ASSISTANT
    // =====================================

    const chatForm =
        document.getElementById("epChatForm");

    const chatWindow =
        document.getElementById("epChatWindow");

    const chatInput =
        document.getElementById("epChatInput");


    function addChatMessage(message, type) {

        const div = document.createElement("div");

        div.className = "ep-chat-message " + type;

        // textContent prevents user text being treated as HTML.
        div.textContent = message;

        chatWindow.appendChild(div);

        chatWindow.scrollTop = chatWindow.scrollHeight;
    }


    function environmentalResponse(question) {

        const q = question.toLowerCase();

        if (q.includes("flood")) {

            return "Heavy rainfall can increase flood risk, " +
                "especially in low-lying areas. Follow official " +
                "weather and disaster-management alerts. Avoid flooded roads.";

        }

        if (q.includes("rain")) {

            return "You can use the Rainfall Intelligence map " +
                "to check the available forecast for your selected location.";

        }

        if (q.includes("harvest") || q.includes("water")) {

            return "Rainwater harvesting can collect rooftop runoff. " +
                "The design depends on roof area, rainfall, soil, " +
                "water quality and local conditions.";

        }

        if (q.includes("pollution") || q.includes("air")) {

            return "Air quality changes by location and time. " +
                "Use verified local air-quality measurements " +
                "before making decisions.";

        }

        if (q.includes("tree") || q.includes("forest")) {

            return "Native trees can support biodiversity and soil health. " +
                "Choose species suitable for the local ecosystem.";

        }

        if (q.includes("climate")) {

            return "Climate change influences temperatures, " +
                "rainfall patterns and ecosystems. Clean energy, " +
                "energy efficiency and ecosystem protection help.";

        }

        if (q.includes("hello") || q.includes("hi")) {

            return "Hello! 🌍 Welcome to EarthPulse AI. " +
                "Ask me about rainfall, water, pollution or sustainability.";

        }

        return "I can help with rainfall, flood precautions, " +
            "rainwater harvesting, pollution and sustainability. " +
            "Please ask a specific environmental question.";
    }


    chatForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const question = chatInput.value.trim();

        if (!question) return;

        addChatMessage(question, "user");

        chatInput.value = "";

        setTimeout(() => {

            const answer = environmentalResponse(question);

            addChatMessage(answer, "bot");

        }, 350);
    });


    // =====================================
    // 6. MAP SIZE REFRESH
    // =====================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", () => {

            setTimeout(() => {

                if (rainMap) rainMap.invalidateSize();

            }, 250);
        });
    });

});