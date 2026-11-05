(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const path = location.pathname;
  const copy = {
    en:{dashboard:"Dashboard",reports:"My reports",signout:"Sign out",search:"Search area",weather:"Local weather",refresh:"Refresh",location:"Use my location",insight:"Generate area insight",language:"Language",loading:"Loading weather…",unavailable:"Weather service is unavailable. Try again."},
    hi:{dashboard:"डैशबोर्ड",reports:"मेरी रिपोर्ट",signout:"लॉग आउट",search:"क्षेत्र खोजें",weather:"स्थानीय मौसम",refresh:"रीफ्रेश",location:"मेरी लोकेशन",insight:"क्षेत्र की जानकारी देखें",language:"भाषा",loading:"मौसम लोड हो रहा है…",unavailable:"मौसम सेवा उपलब्ध नहीं है। फिर कोशिश करें।"},
    mr:{dashboard:"डॅशबोर्ड",reports:"माझे अहवाल",signout:"बाहेर पडा",search:"परिसर शोधा",weather:"स्थानिक हवामान",refresh:"रिफ्रेश",location:"माझे स्थान",insight:"परिसराचा आढावा तयार करा",language:"भाषा",loading:"हवामान लोड होत आहे…",unavailable:"हवामान सेवा उपलब्ध नाही. पुन्हा प्रयत्न करा."}
  };
  const moduleCopy = {
    "/pollution-heatmap":["Air quality snapshot","Compare the selected area's weather context and review community observations. Weather is not an AQI measurement."],
    "/deforestation-tracker":["Vegetation monitoring workspace","Select a region and compare dated, verified satellite imagery when a provider is connected. No forest-loss measurement is fabricated."],
    "/flood-early-warning":["Rainfall preparedness view","Review forecast rainfall context and local drainage observations. This is not an official flood warning."],
    "/water-quality":["Water sampling workspace","Enter laboratory or sensor readings and review the values. Weather cannot determine drinking-water safety."],
    "/biodiversity":["Habitat observation workspace","Record species observations with date and location. Only verified records should be treated as confirmed sightings."],
    "/renewable-energy":["Solar planning workspace","Estimate generation from capacity and sunlight assumptions, then compare the result with your local electricity use."],
    "/green-score":["Sustainability action tracker","Select actions you have completed and calculate your personal points. Scores are self-reported, not an environmental certification."],
    "/community-map":["Community observation explorer","Search a locality, inspect the map and submit a geotagged environmental report only when you choose to share location."]
  };
  let language = localStorage.getItem("ep-language") || "en";
  function addToolbar(){
    const host = $(".ep-top") || $(".ep-topbar") || $(".ep-main");
    if(!host || $("#epExperienceToolbar")) return;
    const bar=document.createElement("div"); bar.id="epExperienceToolbar"; bar.className="ep-experience-toolbar";
    bar.innerHTML=`<div><strong>🌿 EarthPulse Live Workspace</strong><div style="font-size:11px;color:#789084;margin-top:3px">Explore · Check local conditions · Take action</div></div><label style="font-size:11px;color:#668273">${copy[language].language} <select class="ep-language" id="epLanguage"><option value="en">English</option><option value="hi">हिन्दी</option><option value="mr">मराठी</option></select></label>`;
    host.insertAdjacentElement(host.matches(".ep-main")?"afterbegin":"afterend",bar);
    $("#epLanguage").value=language;
    $("#epLanguage").addEventListener("change",e=>{language=e.target.value;localStorage.setItem("ep-language",language);applyLanguage();});
  }
  function applyLanguage(){
    const t=copy[language];
    document.documentElement.lang=language;
    const lang=$("#epLanguage"); if(lang)lang.value=language;
    const labels=[...document.querySelectorAll(".ep-side-link,.ep-nav a")];
    labels.forEach(a=>{const raw=a.textContent.trim().toLowerCase();if(raw.includes("dashboard")||raw.includes("overview"))a.setAttribute("aria-label",t.dashboard);if(raw.includes("my reports"))a.setAttribute("aria-label",t.reports);if(raw.includes("sign out"))a.setAttribute("aria-label",t.signout);});
    const search=$("#epAreaSearch");if(search)search.placeholder=t.search;
    const btn=$("#epAreaFind");if(btn)btn.textContent=t.search;
    const title=$("#epWeatherTitle");if(title)title.textContent=t.weather;
    const loc=$("#epUseLocation");if(loc)loc.textContent=t.location;
    const insight=$("#epInsightButton");if(insight)insight.textContent=t.insight;
  }
  function addWeatherExperience(){
    const main=$(".ep-main"); if(!main || $("#epWeatherExperience"))return;
    const panel=document.createElement("section");panel.id="epWeatherExperience";panel.className="ep-weather-panel";
    panel.innerHTML=`<article class="ep-weather-card"><h3 id="epWeatherTitle">Local weather</h3><div id="epWeatherPlace" style="font-size:12px;color:#e2f5e8">Pune, Maharashtra</div><div class="ep-weather-main"><div class="ep-weather-temp" id="epTemp">--°</div><div><div id="epWeatherCode">Fetching current conditions</div><small id="epWeatherTime">Open-Meteo weather feed</small></div></div><div class="ep-weather-meta"><span id="epHumidity">Humidity --</span><span id="epWind">Wind --</span><span id="epRain">Rain --</span></div><div class="ep-weather-search"><input id="epAreaSearch" value="Pune" aria-label="Search city or area" placeholder="Search city, village or region"><button id="epAreaFind">Search</button></div><div class="ep-weather-foot">Weather from Open-Meteo · Map © OpenStreetMap</div></article><article class="ep-weather-map-card"><div style="display:flex;justify-content:space-between;align-items:center;margin:2px 2px 10px"><b style="font:700 13px Manrope;color:#315d43">Selected area map</b><button class="ep-btn soft" id="epUseLocation" type="button">Use my location</button></div><div id="epWeatherMap" class="ep-weather-map"></div><div id="epMapCaption" style="font-size:10px;color:#82958a;margin:8px 2px 0">Search for a town or allow location access to move the map.</div></article>`;
    const anchor=main.querySelector(".ep-grid") || main.querySelector(".ep-analytics-section") || main.querySelector(".ep-welcome") || main.children[1];
    if(anchor)anchor.insertAdjacentElement("beforebegin",panel); else main.append(panel);
    const insight=document.createElement("section");insight.className="ep-insight-result";insight.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div><b id="epInsightTitle">Area intelligence</b><div style="font-size:10px;color:#809387;margin-top:3px">Contextual guidance for the selected module</div></div><button class="ep-btn" id="epInsightButton">Generate area insight</button></div><p id="epInsightText">Choose a location and generate a focused summary for this workspace.</p>`;
    panel.insertAdjacentElement("afterend",insight);
    $("#epAreaFind").addEventListener("click",searchArea);
    $("#epAreaSearch").addEventListener("keydown",e=>{if(e.key==="Enter")searchArea();});
    $("#epUseLocation").addEventListener("click",useLocation);
    $("#epInsightButton").addEventListener("click",generateInsight);
    loadLeaflet().then(()=>initMap()).catch(()=>{$("#epMapCaption").textContent="Map library could not load. Check your internet connection.";});
    loadWeather(18.5204,73.8567,"Pune, Maharashtra");
    applyLanguage();
  }
  let map, marker, weatherData=null, current={lat:18.5204,lon:73.8567,name:"Pune, Maharashtra"};
  function loadLeaflet(){return new Promise((resolve,reject)=>{if(window.L)return resolve();const css=document.createElement("link");css.rel="stylesheet";css.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";document.head.append(css);const s=document.createElement("script");s.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";s.onload=resolve;s.onerror=reject;document.head.append(s);});}
  function initMap(){const el=$("#epWeatherMap");if(!el||map)return;map=L.map(el).setView([current.lat,current.lon],11);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(map);marker=L.marker([current.lat,current.lon]).addTo(map).bindPopup("Pune, Maharashtra").openPopup();setTimeout(()=>map.invalidateSize(),250);}
  async function searchArea(){const q=$("#epAreaSearch").value.trim();if(!q)return;$("#epWeatherCode").textContent="Searching area…";try{const r=await fetch("https://geocoding-api.open-meteo.com/v1/search?name="+encodeURIComponent(q)+"&count=1&language=en&format=json");const d=await r.json();if(!d.results?.length)throw Error("not-found");const p=d.results[0];current={lat:p.latitude,lon:p.longitude,name:[p.name,p.admin1,p.country].filter(Boolean).join(", ")};if(map){map.setView([current.lat,current.lon],11);marker.setLatLng([current.lat,current.lon]).setPopupContent(current.name).openPopup();}$("#epWeatherPlace").textContent=current.name;$("#epMapCaption").textContent="Map centred on "+current.name;await loadWeather(current.lat,current.lon,current.name);}catch(e){$("#epWeatherCode").textContent="Area not found. Try a nearby town or district.";}}
  async function loadWeather(lat,lon,name){try{const u=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=3&timezone=auto`;const r=await fetch(u);if(!r.ok)throw Error();const d=await r.json(),c=d.current;weatherData=d;$("#epTemp").textContent=Math.round(c.temperature_2m)+"°C";$("#epWeatherCode").textContent=weatherLabel(c.weather_code);$("#epWeatherTime").textContent="Updated "+new Date(c.time).toLocaleString();$("#epHumidity").textContent="Humidity "+c.relative_humidity_2m+"%";$("#epWind").textContent="Wind "+c.wind_speed_10m+" km/h";$("#epRain").textContent="Rain "+c.precipitation+" mm";$("#epWeatherPlace").textContent=name;$("#epMapCaption").textContent="Map centred on "+name+" · 3-day forecast available from the weather service.";}catch(e){$("#epWeatherCode").textContent=copy[language].unavailable;$("#epWeatherTime").textContent="Check connection and retry";}}
  function weatherLabel(code){if(code===0)return"Clear sky";if([1,2,3].includes(code))return"Partly cloudy";if([45,48].includes(code))return"Fog";if([51,53,55,61,63,65,80,81,82].includes(code))return"Rain / drizzle";if([71,73,75,85,86].includes(code))return"Snow";if([95,96,99].includes(code))return"Thunderstorm";return"Current conditions";}
  function useLocation(){if(!navigator.geolocation){$("#epMapCaption").textContent="Location is not supported by this browser.";return;}$("#epMapCaption").textContent="Requesting one-time location permission…";navigator.geolocation.getCurrentPosition(p=>{current={lat:p.coords.latitude,lon:p.coords.longitude,name:"Your selected location"};if(map){map.setView([current.lat,current.lon],13);marker.setLatLng([current.lat,current.lon]).setPopupContent(current.name).openPopup();}loadWeather(current.lat,current.lon,current.name);},()=>{$("#epMapCaption").textContent="Location permission was not granted. Search for an area instead.";},{timeout:10000,maximumAge:60000});}
  async function generateInsight(){const c=moduleCopy[path]||["Local environmental context","Use the selected location's current weather as context, add verified observations and submit a report when you notice an issue. This summary does not replace official measurements or alerts."];$("#epInsightTitle").textContent=c[0]+" · "+current.name;let result=c[1]+" Current weather: "+($("#epTemp").textContent||"not available")+", "+($("#epWeatherCode").textContent||"conditions unavailable")+". Add verified local readings for a stronger assessment.";if(path==="/pollution-heatmap"){try{const r=await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${current.lat}&longitude=${current.lon}&current=pm10,pm2_5,european_aqi,us_aqi&timezone=auto`);if(!r.ok)throw Error();const a=await r.json(),v=a.current;result+=` Live modelled air-quality estimate: European AQI ${v.european_aqi??"—"}, PM2.5 ${v.pm2_5??"—"} µg/m³, PM10 ${v.pm10??"—"} µg/m³. This is a model-based estimate, not a regulatory monitoring station reading.`;}catch(e){result+=" Air-quality feed is unavailable right now; no AQI value is being invented."}}if(path==="/flood-early-warning"&&weatherData?.daily){const d=weatherData.daily;result+=` Forecast rainfall probability (next 3 days): ${(d.precipitation_probability_max||[]).join("%, ")}%. Forecast rainfall totals: ${(d.precipitation_sum||[]).join(", ")} mm. Follow official local alerts.`;}$("#epInsightText").textContent=result;}
  document.addEventListener("DOMContentLoaded",()=>{addToolbar();addWeatherExperience();applyLanguage();});
})();