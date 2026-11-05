(() => {
  const list = document.getElementById('communityReportList');
  const status = document.getElementById('communityMapStatus');
  let map, layer;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pretty = value => String(value || 'SUBMITTED').replaceAll('_',' ').toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
  function initMap(){
    if(!window.L || map) return;
    map=L.map('communityMap').setView([20.5937,78.9629],5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap'}).addTo(map);
    layer=L.featureGroup().addTo(map);
  }
  function render(items){
    const valid=items.filter(x=>Number.isFinite(Number(x.lat))&&Number.isFinite(Number(x.lng)));
    document.getElementById('communityTotal').textContent=items.length;
    document.getElementById('communityReview').textContent=items.filter(x=>['SUBMITTED','UNDER_REVIEW','PENDING'].includes(String(x.status).toUpperCase())).length;
    document.getElementById('communityResolved').textContent=items.filter(x=>String(x.status).toUpperCase()==='RESOLVED').length;
    if(!items.length){list.innerHTML='<div class="ep-empty"><strong>No community reports yet</strong><p>Be the first to record a local environmental observation.</p><a href="/reports/new">Submit an EcoReport →</a></div>';}
    else list.innerHTML=items.slice(0,30).map(x=>`<article class="ep-report-item"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(x.category || 'Environmental issue')}</b><span class="ep-chip">${esc(pretty(x.status))}</span></div><p class="ep-small" style="margin:8px 0">${esc(x.description || 'No description provided')}</p><div class="ep-small">${x.lat!=null&&x.lng!=null?'📍 '+Number(x.lat).toFixed(4)+', '+Number(x.lng).toFixed(4):'Location not shared'}</div></article>`).join('');
    if(!window.L){status.textContent='Map library unavailable';return;}
    initMap();layer.clearLayers();
    valid.forEach(x=>L.marker([Number(x.lat),Number(x.lng)]).addTo(layer).bindPopup(`<b>${esc(x.category)}</b><br>${esc(pretty(x.status))}<br>${esc(x.description||'')}`));
    if(valid.length){map.fitBounds(layer.getBounds().pad(.18),{maxZoom:13});status.textContent=`${valid.length} mapped reports`;}
    else {map.setView([20.5937,78.9629],5);status.textContent='No geotagged reports yet';}
    setTimeout(()=>map.invalidateSize(),150);
  }
  async function load(){
    try{const response=await fetch('/api/reports/map',{headers:{'Accept':'application/json'}});if(!response.ok)throw new Error(`Request failed (${response.status})`);const data=await response.json();render(data);}
    catch(error){status.textContent='Could not load reports';list.innerHTML=`<div class="ep-empty"><strong>Reports could not be loaded.</strong><p>${esc(error.message)}. Check that you are signed in and the application database is available.</p><a href="/login">Sign in again →</a></div>`;}
  }
  document.addEventListener('DOMContentLoaded',load);
})();
