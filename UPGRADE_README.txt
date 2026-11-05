EARTHPULSE AI — INTERACTIVE UI UPGRADE

WHAT CHANGED
- Added a richer responsive visual layer in src/main/resources/static/css/earthpulse-next.css.
- Added src/main/resources/static/js/ep-experience.js and loaded it on all 17 ep-shell pages.
- Added English / Hindi / Marathi language selector. Selection is remembered in this browser.
- Added area search using Open-Meteo geocoding, area-specific current weather, and an interactive OpenStreetMap map.
- Added optional one-time browser location; location is not requested automatically.
- Added module-specific insight text. Pollution page attempts to retrieve modelled AQI/PM values; flood page includes forecast rainfall context.
- Existing controllers, login, reports, database entities and application.properties were not changed.

RUN
1. Extract the ZIP.
2. Open the EarthPulseAI_Java21 folder in VS Code.
3. Keep your existing MySQL database credentials configured locally.
4. Run: mvn clean
5. Run: mvn spring-boot:run
6. Open http://localhost:8080/dashboard

IMPORTANT DATA BOUNDARIES
- Weather is fetched from Open-Meteo when internet is available.
- The map uses OpenStreetMap tiles and requires internet access.
- AQI from Open-Meteo is a modelled estimate, not a regulatory station measurement.
- Browser location works only after the user grants permission.
- Satellite change detection, verified water testing, species counts and official flood warnings are not magically enabled by this UI update; they still require authoritative connected data sources.
- No software can be guaranteed error-free without testing in the target machine's Java 21, Maven, MySQL and browser environment.

CHECKS PERFORMED
- All 14 JavaScript files passed Node syntax checks.
- pom.xml passed XML parsing.
- All 17 pages using the ep-shell layout load the new interaction script.
- Maven is not installed in the packaging environment, so a full Maven build and browser test could not be performed.
