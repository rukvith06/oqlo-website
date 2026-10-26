/* ==========================================================================
   OQLO.AI - Section 3: Digital Twin Platform 3D Scene (Optimized)
   Features: IntersectionObserver Pausing, Low CPU/GPU Overhead,
   Measurement Tools, Clickable Data Markers
   ========================================================================== */

(function () {
  const container = document.getElementById('twin-canvas-container');
  if (!container) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF5FAFD);

  const width = container.clientWidth || 700;
  const height = container.clientHeight || 520;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
  camera.position.set(32, 24, 34);
  camera.lookAt(0, 2, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  container.appendChild(renderer.domElement);

  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 12;
    controls.maxDistance = 75;
    controls.target.set(0, 2, 0);
  }

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xE0F2FE, 0.9);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xFFFFFF, 0.85);
  sunLight.position.set(25, 45, 20);
  scene.add(sunLight);

  // Digital Twin Terrain
  const siteGeo = new THREE.PlaneGeometry(38, 38, 24, 24);
  siteGeo.rotateX(-Math.PI / 2);
  const pos = siteGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = Math.sin(x * 0.16) * Math.cos(z * 0.16) * 1.6;
    pos.setY(i, y);
  }
  siteGeo.computeVertexNormals();

  const siteMat = new THREE.MeshStandardMaterial({
    color: 0xEEF8FC,
    roughness: 0.7,
    metalness: 0.05
  });
  const siteMesh = new THREE.Mesh(siteGeo, siteMat);
  scene.add(siteMesh);

  // Grid
  const grid = new THREE.GridHelper(40, 20, 0x0088EA, 0xCBD5E1);
  grid.position.y = -0.05;
  scene.add(grid);

  // White Buildings
  const buildingsGroup = new THREE.Group();
  scene.add(buildingsGroup);

  const bMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.4
  });

  const bData = [
    { x: -7, z: -5, w: 8, h: 6.5, d: 7, name: "Facility Complex Alpha" },
    { x: 6, z: -7, w: 6, h: 4.8, d: 6, name: "Storage Warehouse B" },
    { x: -7, z: 7, w: 5, h: 3.8, d: 6, name: "Operations Hub" },
    { x: 7, z: 6, w: 7, h: 5.8, d: 7, name: "Material Processing Unit" }
  ];

  bData.forEach(b => {
    const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
    const mesh = new THREE.Mesh(geo, bMat);
    mesh.position.set(b.x, b.h / 2 + 0.3, b.z);
    buildingsGroup.add(mesh);

    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x64748B }));
    mesh.add(line);
  });

  // Stockpile Cone
  const moundGeo = new THREE.ConeGeometry(4.5, 3.0, 14);
  const moundMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.8 });
  const mound = new THREE.Mesh(moundGeo, moundMat);
  mound.position.set(11, 1.5, -1);
  scene.add(mound);

  // Point Cloud Layer
  const ptCount = 200;
  const ptGeo = new THREE.BufferGeometry();
  const ptPositions = new Float32Array(ptCount * 3);
  for (let i = 0; i < ptCount; i++) {
    ptPositions[i * 3] = (Math.random() - 0.5) * 34;
    ptPositions[i * 3 + 1] = Math.random() * 7 + 0.5;
    ptPositions[i * 3 + 2] = (Math.random() - 0.5) * 34;
  }
  ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPositions, 3));
  const ptMat = new THREE.PointsMaterial({ color: 0x0088EA, size: 0.5 });
  const pts = new THREE.Points(ptGeo, ptMat);
  scene.add(pts);

  // Dynamic Measurement Lines
  const measureGroup = new THREE.Group();
  scene.add(measureGroup);

  const p1 = new THREE.Vector3(-7, 7.0, -1);
  const p2 = new THREE.Vector3(6, 5.2, -4);
  const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
  const lineMat = new THREE.LineDashedMaterial({
    color: 0x0088EA,
    dashSize: 0.6,
    gapSize: 0.3
  });
  const measureLine = new THREE.Line(lineGeo, lineMat);
  measureLine.computeLineDistances();
  measureGroup.add(measureLine);

  [p1, p2].forEach(p => {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0x0088EA })
    );
    dot.position.copy(p);
    measureGroup.add(dot);
  });

  // Interactive Data Markers
  const markers = [
    {
      pos: new THREE.Vector3(-7, 7.2, -5),
      id: "MARKER-402",
      title: "Survey Marker #402",
      elevation: "+124.5 m",
      area: "12,450 sq ft",
      status: "Centimeter Accuracy Verified"
    },
    {
      pos: new THREE.Vector3(11, 4.6, -1),
      id: "VOL-01",
      title: "Stockpile Volume #A",
      elevation: "+118.2 m",
      area: "4,820 m³ Calculated",
      status: "Cut/Fill Analyzed"
    },
    {
      pos: new THREE.Vector3(7, 6.4, 6),
      id: "BOUNDARY-09",
      title: "Boundary Point #09",
      elevation: "+121.0 m",
      area: "RTK Fixed (Centimeter)",
      status: "Legal Cadastral Georeferenced"
    }
  ];

  const markerMeshes = [];
  markers.forEach(m => {
    const pinGroup = new THREE.Group();
    pinGroup.position.copy(m.pos);

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 1.2, 6),
      new THREE.MeshBasicMaterial({ color: 0x0F172A })
    );
    stem.position.y = 0.6;
    pinGroup.add(stem);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x0088EA })
    );
    head.position.y = 1.2;
    pinGroup.add(head);

    pinGroup.userData = m;
    scene.add(pinGroup);
    markerMeshes.push(pinGroup);
  });

  // Raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPointerDown(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let hit of intersects) {
      let obj = hit.object;
      while (obj.parent && !obj.userData.id && obj !== scene) {
        obj = obj.parent;
      }
      if (obj.userData && obj.userData.id) {
        updateTwinPanel(obj.userData);
        break;
      }
    }
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);

  function updateTwinPanel(data) {
    const titleEl = document.getElementById('twin-active-title');
    const elevEl = document.getElementById('twin-active-elev');
    const areaEl = document.getElementById('twin-active-area');
    const statusEl = document.getElementById('twin-active-status');

    if (titleEl) titleEl.textContent = data.title;
    if (elevEl) elevEl.textContent = data.elevation;
    if (areaEl) areaEl.textContent = data.area;
    if (statusEl) statusEl.textContent = data.status;
  }

  // Performance Optimization: IntersectionObserver
  let isVisible = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.05 });
  observer.observe(container);

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const time = performance.now() * 0.002;
    markerMeshes.forEach(m => {
      m.position.y = m.userData.pos.y + Math.sin(time + m.userData.pos.x) * 0.12;
    });

    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  window.addEventListener('resize', () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }, { passive: true });
})();
