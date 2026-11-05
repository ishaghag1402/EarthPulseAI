document.addEventListener('DOMContentLoaded', function () {
  const date = document.getElementById('epToday');
  if (date) date.textContent = new Intl.DateTimeFormat('en-IN', {weekday:'short', day:'numeric', month:'short', year:'numeric'}).format(new Date());
  if (typeof Chart === 'undefined') return;
  Chart.defaults.font.family = "'DM Sans', sans-serif";
  Chart.defaults.color = '#829188';
  const pie = document.getElementById('environmentPieChart');
  if (pie) new Chart(pie, {type:'doughnut',data:{labels:['Air quality','Water','Green cover','Waste','Climate'],datasets:[{data:[28,24,22,16,10],backgroundColor:['#3aa879','#5aa9d7','#9abf70','#9a86d2','#edb65e'],borderWidth:3,borderColor:'#fff',hoverOffset:7}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{display:false},tooltip:{callbacks:{label:(c)=>`${c.label}: ${c.raw}% (sample)`}}}}});
  const line = document.getElementById('climateLineChart');
  if (line) new Chart(line,{type:'line',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'Temperature index',data:[42,51,48,63,59,70,66],borderColor:'#e8a34d',backgroundColor:'#e8a34d18',tension:.38,fill:true,pointRadius:3},{label:'Rainfall index',data:[28,34,31,45,40,53,48],borderColor:'#5aa9d7',backgroundColor:'#5aa9d718',tension:.38,fill:true,pointRadius:3},{label:'Green index',data:[18,20,27,25,32,35,39],borderColor:'#39a875',backgroundColor:'#39a87518',tension:.38,fill:true,pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'bottom',labels:{boxWidth:8,usePointStyle:true,font:{size:9}}}},scales:{x:{grid:{display:false},ticks:{font:{size:9}}},y:{beginAtZero:true,max:80,grid:{color:'#edf2ee'},ticks:{font:{size:9}}}}}});
  const bar = document.getElementById('activityBarChart');
  if (bar) new Chart(bar,{type:'bar',data:{labels:['Earth','Climate','Water','Nature','Waste'],datasets:[{label:'Sample activity',data:[82,68,74,59,46],backgroundColor:['#70b78d','#7eb6d5','#78c4c5','#a5bd7a','#b09bd4'],borderRadius:7,maxBarThickness:30}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:9}}},y:{beginAtZero:true,max:100,grid:{color:'#edf2ee'},ticks:{font:{size:9}}}}}});
});