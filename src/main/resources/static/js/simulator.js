const simulatorForm = document.getElementById('simForm');

simulatorForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const number = (id) => Number(document.getElementById(id)?.value);
  const roof = number('roofArea');
  const rainfall = number('annualRainMm');
  const efficiency = number('efficiency');
  const green = number('greenIncrease');
  const waste = number('wasteReduction');
  const note = document.getElementById('simNote');

  const values = [roof, rainfall, efficiency, green, waste];
  if (values.some((value) => !Number.isFinite(value)) ||
      roof < 0 || roof > 100000 || rainfall < 0 || rainfall > 5000 ||
      efficiency < 0 || efficiency > 1 || green < 0 || green > 100 ||
      waste < 0 || waste > 100) {
    note.textContent = 'Please enter valid values within the displayed limits.';
    return;
  }

  // 1 mm rainfall on 1 m² = approximately 1 litre before collection losses.
  const harvestLitres = roof * rainfall * efficiency;
  document.getElementById('simResults').hidden = false;
  document.getElementById('waterResult').textContent = Math.round(harvestLitres).toLocaleString('en-IN');
  document.getElementById('greenResult').textContent = `${green}%`;
  document.getElementById('wasteResult').textContent = `${waste}%`;
  note.textContent = 'Illustrative estimate calculated in your browser from the assumptions entered. It is not a validated local forecast.';
});
