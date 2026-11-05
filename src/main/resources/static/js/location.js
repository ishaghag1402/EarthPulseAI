const consent=document.getElementById('shareLocation'), locate=document.getElementById('locateBtn');
if(locate) locate.addEventListener('click',()=>{
 const status=document.getElementById('locationStatus');
 if(!consent.checked){status.textContent='First tick the consent box if you want this report to include your location.';return;}
 if(!navigator.geolocation){status.textContent='Geolocation is not supported by this browser.';return;}
 status.textContent='Requesting one-time location permission…';
 navigator.geolocation.getCurrentPosition(pos=>{
  document.getElementById('latitude').value=pos.coords.latitude;
  document.getElementById('longitude').value=pos.coords.longitude;
  status.textContent='Location added to this report only. No background tracking.';
 },()=>{status.textContent='Location unavailable or permission denied. You can submit without it.';},{enableHighAccuracy:false,timeout:10000,maximumAge:60000});
});
if(consent) consent.addEventListener('change',()=>{if(!consent.checked){document.getElementById('latitude').value='';document.getElementById('longitude').value='';}});
