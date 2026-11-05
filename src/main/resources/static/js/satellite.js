let beforeUrl = null;
let afterUrl = null;
function wirePreview(inputId, imageId, assign) {
  document.getElementById(inputId)?.addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose a valid image file.');
      event.target.value = '';
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      alert('Please choose an image smaller than 15 MB.');
      event.target.value = '';
      return;
    }
    const url = URL.createObjectURL(file);
    const image = document.getElementById(imageId);
    if (image.dataset.objectUrl) URL.revokeObjectURL(image.dataset.objectUrl);
    image.src = url;
    image.dataset.objectUrl = url;
    assign(url);
  });
}
wirePreview('beforeImage', 'beforePreview', url => beforeUrl = url);
wirePreview('afterImage', 'afterPreview', url => afterUrl = url);
document.getElementById('compareBtn')?.addEventListener('click', () => {
  const output = document.getElementById('comparisonResult');
  output.hidden = false;
  if (!beforeUrl || !afterUrl) {
    output.textContent = 'Choose both images before comparing.';
    return;
  }
  output.textContent = 'Both images are loaded for side-by-side visual inspection. This feature does not calculate NDVI or verify deforestation. Scientific vegetation analysis requires aligned, georeferenced multispectral imagery and validated red/NIR processing.';
});
