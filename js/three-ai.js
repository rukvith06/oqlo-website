/* ==========================================================================
   OQLO.AI - Section 5: AI Spatial Analytics 3D Visualization
   Realistic Architectural Buildings (Podium, Facades, Roof Parapets, HVAC),
   Smooth AI Laser Scanning & Bounding Frames, Zero Lag
   ========================================================================== */

(function () {
  const container = document.getElementById('ai-canvas-container');
  if (!container) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF5FAFD);

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 460;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 400);
  camera.position.set(24, 18, 26);
  camera.lookAt(0, 3, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
  renderer.shadowMap.enabled = false; // Zero shadow overhead for ultra-smooth 60fps
  container.appendChild(renderer.domElement);

  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 12;
    controls.maxDistance = 50;
    controls.target.set(0, 3, 0);
  }

  // Soft Lighting
  scene.add(new THREE.AmbientLight(0xE0F2FE, 0.95));
  const sun = new THREE.DirectionalLight(0xFFFFFF, 0.9);
  sun.position.set(25, 40, 20);
  scene.add(sun);

  // Topographic Terrain
  const tGeo = new THREE.PlaneGeometry(32, 32, 22, 22);
  tGeo.rotateX(-Math.PI / 2);
  const pos = tGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = Math.sin(x * 0.2) * Math.cos(z * 0.2) * 1.2;
    pos.setY(i, y);
  }
  tGeo.computeVertexNormals();

  const tMat = new THREE.MeshStandardMaterial({ color: 0xEEF8FC, roughness: 0.6 });
  const tMesh = new THREE.Mesh(tGeo, tMat);
  scene.add(tMesh);

  // Subtle Wireframe
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(tGeo),
    new THREE.LineBasicMaterial({ color: 0xBAE6FD, transparent: true, opacity: 0.4 })
  );
  scene.add(wire);

  // Materials for Real Architectural Buildings
  const whiteWallMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.35 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x1E3A5F, roughness: 0.1, metalness: 0.8 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.6 });
  const trimMat = new THREE.LineBasicMaterial({ color: 0x64748B });
  const aiBoxMat = new THREE.LineBasicMaterial({ color: 0x0088EA });

  const buildingsGroup = new THREE.Group();
  scene.add(buildingsGroup);

  // --- Real World Building 1: Commercial Multi-Story Office / Facility Alpha ---
  const b1 = new THREE.Group();
  b1.position.set(-6, 0.4, -2);

  // 1. Ground Podium Floor
  const b1Podium = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.8, 8.2), whiteWallMat);
  b1Podium.position.y = 0.9;
  b1.add(b1Podium);

  // Glass entrance band
  const b1Glass = new THREE.Mesh(new THREE.BoxGeometry(7.24, 0.9, 8.24), glassMat);
  b1Glass.position.y = 0.8;
  b1.add(b1Glass);

  // Entrance canopy
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 1.8), whiteWallMat);
  canopy.position.set(0, 1.2, 4.3);
  b1.add(canopy);

  // 2. Tower Floors (Upper Stories)
  const b1Tower = new THREE.Mesh(new THREE.BoxGeometry(6.4, 4.2, 7.2), whiteWallMat);
  b1Tower.position.y = 3.9;
  b1.add(b1Tower);

  // Multiple floor window ribbons
  [2.6, 3.8, 5.0].forEach(wy => {
    const windowBand = new THREE.Mesh(new THREE.BoxGeometry(6.45, 0.65, 7.25), glassMat);
    windowBand.position.y = wy;
    b1.add(windowBand);
  });

  // 3. Roof Parapet & Terrace
  const parapet = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.35, 7.3), whiteWallMat);
  parapet.position.y = 6.15;
  b1.add(parapet);

  // Rooftop Elevator Penthouse
  const penthouse = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 2.6), whiteWallMat);
  penthouse.position.set(-1.0, 6.6, -0.6);
  b1.add(penthouse);

  // Rooftop HVAC Chiller Units
  [-1.2, 0.8].forEach(hx => {
    const hvac = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 1.4), roofMat);
    hvac.position.set(hx, 6.35, 1.8);
    b1.add(hvac);
  });

  // Edge lines for CAD/BIM definition
  const b1Edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(6.4, 4.2, 7.2)), trimMat);
  b1Edges.position.y = 3.9;
  b1.add(b1Edges);

  buildingsGroup.add(b1);

  // --- Real World Building 2: Industrial Logistics Facility / Gabled Warehouse ---
  const b2 = new THREE.Group();
  b2.position.set(6, 0.3, 3);

  // Main Warehouse Hall
  const b2Hall = new THREE.Mesh(new THREE.BoxGeometry(6.5, 3.2, 6.0), whiteWallMat);
  b2Hall.position.y = 1.6;
  b2.add(b2Hall);

  // Pitched / Gabled Roof
  const roofGeo = new THREE.CylinderGeometry(0.1, 4.4, 6.0, 4);
  roofGeo.rotateZ(Math.PI / 4);
  roofGeo.rotateY(Math.PI / 2);
  const roofMesh = new THREE.Mesh(roofGeo, roofMat);
  roofMesh.position.set(0, 4.2, 0);
  b2.add(roofMesh);

  // Industrial Loading Bay Doors
  [-1.8, 0, 1.8].forEach(dx => {
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 0.15), glassMat);
    door.position.set(dx, 0.9, 3.05);
    b2.add(door);
  });

  // Rooftop skylight vent ridge
  const skylight = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.3, 5.2), glassMat);
  skylight.position.set(0, 4.8, 0);
  b2.add(skylight);

  buildingsGroup.add(b2);

  // AI 3D Bounding Boxes (Visualizing Automated Structural Asset Classification)
  const aiBoxesGroup = new THREE.Group();
  scene.add(aiBoxesGroup);

  function createAiBBox(w, h, d, x, y, z) {
    const boxGeo = new THREE.BoxGeometry(w, h, d);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    const boxLine = new THREE.LineSegments(boxEdges, aiBoxMat);
    boxLine.position.set(x, y, z);
    aiBoxesGroup.add(boxLine);

    // Corner targeting dots
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshBasicMaterial({ color: 0x0088EA }));
    dot.position.set(x + w / 2, y + h / 2, z + d / 2);
    aiBoxesGroup.add(dot);
  }

  createAiBBox(7.8, 7.6, 8.8, -6, 3.8, -2);
  createAiBBox(7.2, 5.6, 6.8, 6, 2.6, 3);

  // AI Vertical Scanning Laser Plane
  const scanPlaneGeo = new THREE.PlaneGeometry(32, 12);
  scanPlaneGeo.rotateY(Math.PI / 2);
  const scanPlaneMat = new THREE.MeshBasicMaterial({
    color: 0x0088EA,
    transparent: true,
    opacity: 0.14,
    side: THREE.DoubleSide
  });
  const scanPlane = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
  scanPlane.position.y = 4;
  scene.add(scanPlane);

  let scanPos = -14;
  function animateScan(delta) {
    scanPos += delta * 4.8;
    if (scanPos > 14) scanPos = -14;
    scanPlane.position.x = scanPos;
  }

  // Smooth IntersectionObserver (Pauses rendering when scrolled off-screen)
  let isVisible = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.05 });
  observer.observe(container);

  let lastTime = performance.now();
  function animate(now) {
    requestAnimationFrame(animate);
    if (!isVisible) return; // Zero CPU/GPU work when offscreen!

    const delta = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    animateScan(delta);

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
