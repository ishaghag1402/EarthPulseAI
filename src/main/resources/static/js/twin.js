(() => {
  const mapElement = document.getElementById('map');
  if (mapElement && window.L) {
    const map = L.map(mapElement).setView([19.2, 73.0], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    const markerLayer = L.layerGroup().addTo(map);
    async function loadMarkers() {
      const button = document.getElementById('refreshMarkers');
      if (button) button.disabled = true;
      try {
        const response = await fetch('/api/reports/map', {credentials: 'same-origin'});
        if (!response.ok) throw new Error(`Map request failed (${response.status})`);
        const rows = await response.json();
        markerLayer.clearLayers();
        rows.forEach(report => {
          if (Number.isFinite(report.lat) && Number.isFinite(report.lng)) {
            L.marker([report.lat, report.lng]).addTo(markerLayer)
              .bindPopup(`<strong>${String(report.category)}</strong><br>Status: ${String(report.status)}`);
          }
        });
      } catch (error) {
        console.error('Could not load report markers:', error);
      } finally {
        if (button) button.disabled = false;
      }
    }
    loadMarkers();
    document.getElementById('refreshMarkers')?.addEventListener('click', loadMarkers);
  }

  const mount = document.getElementById('village3d');
  if (!mount || !window.THREE) return;
  try {
    const THREE = window.THREE;
    const width = Math.max(mount.clientWidth, 320);
    const height = 330;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeaf3ec);
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(8, 8, 11);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    mount.replaceChildren(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x7c9b82, 2));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(4, 8, 5);
    scene.add(light);
    const ground = new THREE.Mesh(new THREE.BoxGeometry(12, .2, 10),
      new THREE.MeshStandardMaterial({color: 0xb9d7b6}));
    ground.position.y = -.2;
    scene.add(ground);
    const layers = {homes: [], roads: [], water: [], green: []};
    function addBox(layer, x, y, z, w, h, d, color) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({color}));
      mesh.position.set(x, y, z);
      scene.add(mesh);
      layers[layer].push(mesh);
    }
    for (let i = 0; i < 8; i++) {
      const x = (i % 4) * 2.5 - 3.75;
      const z = Math.floor(i / 4) * 3 - 1.5;
      addBox('homes', x, .5, z, 1.2, 1, 1.1, 0xf4e7c9);
      addBox('homes', x, 1.06, z, 1.3, .12, 1.2, 0x8bb69a);
    }
    addBox('roads', 0, .01, 0, 11, .06, .55, 0xe5dfce);
    addBox('roads', 0, .02, 0, .5, .07, 9, 0xe5dfce);
    addBox('water', 4, .03, 3, 2, .06, 1.2, 0x86c6d1);
    for (let i = 0; i < 6; i++) addBox('green', -5 + i * 1.7, .25, 3, .8, .5, .8, 0x76a77c);
    document.querySelectorAll('[data-layer]').forEach(control => {
      control.addEventListener('change', () => {
        (layers[control.dataset.layer] || []).forEach(object => object.visible = control.checked);
      });
    });
    let frame;
    function animate() {
      frame = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
    window.addEventListener('beforeunload', () => {
      cancelAnimationFrame(frame);
      renderer.dispose();
    });
    window.addEventListener('resize', () => {
      const w = Math.max(mount.clientWidth, 320);
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    });
  } catch (error) {
    mount.textContent = 'The 3D view is not available in this browser. The rest of the dashboard remains usable.';
    console.error('3D scene initialization failed:', error);
  }
})();
