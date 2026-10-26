/* ==========================================================================
   OQLO.AI - 3D Hero Surveying Visualization (Optimized Three.js)
   Features:
   - Realistic Architectural Buildings (Multi-story, Glass Ribbons, HVAC, Penthouses)
   - Interactive Spatial Tools:
     * #tool-hand: 360 Orbit & Pan Navigation
     * #tool-measure: 3D Laser Dimensioning & Interactive Click-to-Measure
     * #tool-pin: Survey Benchmark Pins with Pulsing Radar & Geodetic Coordinates
   - 60fps Zero-Lag Engine (IntersectionObserver, Clamped Pixel Ratio, No Heavy Shadows)
   ========================================================================== */

(function () {
  const container = document.getElementById('hero-canvas-container');
  if (!container) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF5FAFD);

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 540;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
  camera.position.set(38, 28, 42);
  camera.lookAt(0, 3, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
  renderer.shadowMap.enabled = false; // Zero shadow overhead for silky 60fps
  container.appendChild(renderer.domElement);

  let controls = null;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 15;
    controls.maxDistance = 85;
    controls.target.set(0, 3, 0);
  }

  // Soft clean lighting
  const ambientLight = new THREE.AmbientLight(0xE0F2FE, 0.95);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xFFFFFF, 0.9);
  sunLight.position.set(35, 45, 25);
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0xBAE6FD, 0.4);
  fillLight.position.set(-20, 15, -15);
  scene.add(fillLight);

  // Subtle Survey Grid Floor
  const gridHelper = new THREE.GridHelper(50, 25, 0x0088EA, 0xCBD5E1);
  gridHelper.position.y = -0.05;
  scene.add(gridHelper);

  // Light Blue Terrain Mesh
  const terrainGeo = new THREE.PlaneGeometry(44, 44, 30, 30);
  terrainGeo.rotateX(-Math.PI / 2);

  const posAttr = terrainGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    const h = Math.sin(x * 0.14) * Math.cos(z * 0.14) * 2.2 +
              Math.sin(x * 0.28 + 1.2) * 0.8;
    posAttr.setY(i, h);
  }
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0xEEF8FC,
    roughness: 0.7,
    metalness: 0.05
  });
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  scene.add(terrainMesh);

  // Contour Wireframe Overlay
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xBAE6FD,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const wireMesh = new THREE.Mesh(terrainGeo, wireMat);
  wireMesh.position.y = 0.02;
  scene.add(wireMesh);

  // ==========================================================================
  // REAL-WORLD ARCHITECTURAL BUILDINGS (Multi-Story, Facade Glass, Parapets, HVAC)
  // ==========================================================================
  const structuresGroup = new THREE.Group();
  scene.add(structuresGroup);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.35, metalness: 0.05 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x1E3A5F, roughness: 0.15, metalness: 0.75 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.65 });
  const hvacMat = new THREE.MeshStandardMaterial({ color: 0x64748B, roughness: 0.4 });
  const trimMat = new THREE.LineBasicMaterial({ color: 0x64748B });
  const accentLineMat = new THREE.LineBasicMaterial({ color: 0x0088EA });

  function addBuildingEdges(mesh, mat) {
    const edges = new THREE.EdgesGeometry(mesh.geometry);
    const line = new THREE.LineSegments(edges, mat || trimMat);
    mesh.add(line);
  }

  // --- Building 1: Corporate Operations Headquarters (Multi-Tier Tower) ---
  const b1 = new THREE.Group();
  b1.position.set(-7, 1.2, -5);

  // Ground Podium
  const b1Podium = new THREE.Mesh(new THREE.BoxGeometry(8.5, 2.2, 9.5), wallMat);
  b1Podium.position.y = 1.1;
  addBuildingEdges(b1Podium);
  b1.add(b1Podium);

  // Glass entrance band
  const b1EntGlass = new THREE.Mesh(new THREE.BoxGeometry(8.54, 1.1, 9.54), glassMat);
  b1EntGlass.position.y = 1.0;
  b1.add(b1EntGlass);

  // Entrance Portico Canopy
  const b1Canopy = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.2, 2.2), wallMat);
  b1Canopy.position.set(0, 1.6, 5.0);
  addBuildingEdges(b1Canopy);
  b1.add(b1Canopy);

  // Tower Upper Floors (4 stories)
  const b1Tower = new THREE.Mesh(new THREE.BoxGeometry(7.2, 5.6, 8.0), wallMat);
  b1Tower.position.y = 2.2 + 2.8;
  addBuildingEdges(b1Tower);
  b1.add(b1Tower);

  // Facade Glass Ribbon Strips
  for (let floor = 0; floor < 3; floor++) {
    const ribbon = new THREE.Mesh(new THREE.BoxGeometry(7.26, 0.75, 8.06), glassMat);
    ribbon.position.y = 2.9 + floor * 1.5;
    b1.add(ribbon);
  }

  // Roof Parapet Border
  const b1Parapet = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.4, 8.2), roofMat);
  b1Parapet.position.y = 2.2 + 5.6 + 0.2;
  addBuildingEdges(b1Parapet);
  b1.add(b1Parapet);

  // Elevator Penthouse Machine Room
  const b1Penthouse = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 3.2), wallMat);
  b1Penthouse.position.set(-1.2, 2.2 + 5.6 + 0.7, -1.0);
  addBuildingEdges(b1Penthouse);
  b1.add(b1Penthouse);

  // Rooftop Dual HVAC Chillers
  const hvac1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 1.2), hvacMat);
  hvac1.position.set(1.6, 2.2 + 5.6 + 0.4, 1.2);
  b1.add(hvac1);

  const hvac2 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 1.2), hvacMat);
  hvac2.position.set(1.6, 2.2 + 5.6 + 0.4, -1.2);
  b1.add(hvac2);

  structuresGroup.add(b1);

  // --- Building 2: Engineering & Technology Facility ---
  const b2 = new THREE.Group();
  b2.position.set(5, 0.8, -8);

  const b2Base = new THREE.Mesh(new THREE.BoxGeometry(7.5, 4.5, 6.5), wallMat);
  b2Base.position.y = 2.25;
  addBuildingEdges(b2Base);
  b2.add(b2Base);

  // Continuous Ribbon Windows
  const b2Glass1 = new THREE.Mesh(new THREE.BoxGeometry(7.56, 0.9, 6.56), glassMat);
  b2Glass1.position.y = 1.6;
  b2.add(b2Glass1);

  const b2Glass2 = new THREE.Mesh(new THREE.BoxGeometry(7.56, 0.9, 6.56), glassMat);
  b2Glass2.position.y = 3.2;
  b2.add(b2Glass2);

  // Roof Mechanical Deck
  const b2RoofMech = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.7, 3.0), hvacMat);
  b2RoofMech.position.set(0, 4.85, 0);
  addBuildingEdges(b2RoofMech);
  b2.add(b2RoofMech);

  structuresGroup.add(b2);

  // --- Building 3: Research Center & Terrace Wing ---
  const b3 = new THREE.Group();
  b3.position.set(10, 1.0, 6);

  const b3Lower = new THREE.Mesh(new THREE.BoxGeometry(8.0, 3.6, 7.5), wallMat);
  b3Lower.position.y = 1.8;
  addBuildingEdges(b3Lower);
  b3.add(b3Lower);

  const b3Glass = new THREE.Mesh(new THREE.BoxGeometry(8.06, 1.2, 7.56), glassMat);
  b3Glass.position.y = 1.8;
  b3.add(b3Glass);

  // Stepped Upper Terrace
  const b3Upper = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.8, 5.0), wallMat);
  b3Upper.position.set(-1.0, 3.6 + 1.4, -0.8);
  addBuildingEdges(b3Upper);
  b3.add(b3Upper);

  const b3UpperGlass = new THREE.Mesh(new THREE.BoxGeometry(5.26, 0.8, 5.06), glassMat);
  b3UpperGlass.position.set(-1.0, 3.6 + 1.4, -0.8);
  b3.add(b3UpperGlass);

  structuresGroup.add(b3);

  // --- Building 4: Logistics & Survey Workshop ---
  const b4 = new THREE.Group();
  b4.position.set(-11, 0.6, 7);

  const b4Mesh = new THREE.Mesh(new THREE.BoxGeometry(6.0, 3.2, 5.5), wallMat);
  b4Mesh.position.y = 1.6;
  addBuildingEdges(b4Mesh);
  b4.add(b4Mesh);

  // Roll-up Bay Door
  const bayDoor = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.0, 0.1), glassMat);
  bayDoor.position.set(0, 1.0, 2.76);
  b4.add(bayDoor);

  structuresGroup.add(b4);

  // Blue Data Points (Point Cloud Nodes)
  const pointsCount = 260;
  const pointsGeo = new THREE.BufferGeometry();
  const pointsPos = new Float32Array(pointsCount * 3);
  for (let i = 0; i < pointsCount; i++) {
    const px = (Math.random() - 0.5) * 40;
    const pz = (Math.random() - 0.5) * 40;
    const py = (Math.sin(px * 0.14) * Math.cos(pz * 0.14) * 2.2 + 0.8) + Math.random() * 2.0;
    pointsPos[i * 3] = px;
    pointsPos[i * 3 + 1] = py;
    pointsPos[i * 3 + 2] = pz;
  }
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(pointsPos, 3));
  const pointsMat = new THREE.PointsMaterial({
    color: 0x0088EA,
    size: 0.55,
    sizeAttenuation: true
  });
  const pointCloud = new THREE.Points(pointsGeo, pointsMat);
  scene.add(pointCloud);

  // ==========================================================================
  // PROFESSIONAL SURVEYING DRONE
  // ==========================================================================
  const drone = new THREE.Group();
  scene.add(drone);

  const droneWhiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 });
  const droneCharcoalMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4 });
  const droneBlueMat = new THREE.MeshStandardMaterial({ color: 0x0088EA, roughness: 0.3 });

  // Fuselage
  const bodyGeo = new THREE.BoxGeometry(2.2, 0.8, 2.8);
  const bodyMesh = new THREE.Mesh(bodyGeo, droneWhiteMat);
  drone.add(bodyMesh);

  // RTK GNSS Antenna Dome
  const rtkGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 12);
  const rtkMesh = new THREE.Mesh(rtkGeo, droneBlueMat);
  rtkMesh.position.set(0, 0.65, -0.5);
  drone.add(rtkMesh);

  // 4 Arms & Rotors
  const armLen = 2.4;
  const rotorBlades = [];
  const armAngles = [Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4];
  armAngles.forEach(ang => {
    const armGeo = new THREE.CylinderGeometry(0.1, 0.1, armLen, 6);
    armGeo.rotateZ(Math.PI / 2);
    armGeo.rotateY(ang);
    const armMesh = new THREE.Mesh(armGeo, droneCharcoalMat);
    armMesh.position.y = 0.05;
    drone.add(armMesh);

    const mx = Math.cos(ang) * armLen * 0.95;
    const mz = Math.sin(ang) * armLen * 0.95;

    const propGeo = new THREE.BoxGeometry(1.8, 0.03, 0.18);
    const propMesh = new THREE.Mesh(propGeo, droneCharcoalMat);
    propMesh.position.set(mx, 0.35, mz);
    drone.add(propMesh);
    rotorBlades.push(propMesh);
  });

  // Gimbal Camera
  const gimbalGeo = new THREE.SphereGeometry(0.4, 12, 12);
  const gimbal = new THREE.Mesh(gimbalGeo, droneCharcoalMat);
  gimbal.position.set(0, -0.55, 0.4);
  drone.add(gimbal);

  // Scanning Light-Blue Cone
  const scanGeo = new THREE.ConeGeometry(4.8, 10, 4, 1, true);
  scanGeo.rotateX(Math.PI);
  const scanMat = new THREE.MeshBasicMaterial({
    color: 0x0088EA,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide
  });
  const scanFrustum = new THREE.Mesh(scanGeo, scanMat);
  scanFrustum.position.set(0, -5.55, 0.4);
  drone.add(scanFrustum);

  // Scanning Ground Ring
  const ringGeo = new THREE.RingGeometry(3.6, 3.9, 24);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x0088EA,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide
  });
  const scanRing = new THREE.Mesh(ringGeo, ringMat);
  scene.add(scanRing);

  drone.position.set(-10, 13, -6);

  // ==========================================================================
  // SPATIAL TOOLS INTERACTIVE SYSTEM (Item 3: Hand, Measure, Pin)
  // ==========================================================================
  const toolsGroup = new THREE.Group();
  scene.add(toolsGroup);

  // --- 1. Measure Mode Visuals (3D Dimension Lines & Endpoints) ---
  const measureGroup = new THREE.Group();
  measureGroup.visible = false;
  toolsGroup.add(measureGroup);

  function createDimensionLine(p1, p2, labelText) {
    const dimSub = new THREE.Group();

    // Dashed line
    const points = [p1, p2];
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x0088EA,
      dashSize: 0.8,
      gapSize: 0.4,
      linewidth: 2
    });
    const line = new THREE.Line(geom, lineMat);
    line.computeLineDistances();
    dimSub.add(line);

    // Endpoints
    const ptMat = new THREE.MeshBasicMaterial({ color: 0x0284C7 });
    const pt1 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), ptMat);
    pt1.position.copy(p1);
    dimSub.add(pt1);

    const pt2 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), ptMat);
    pt2.position.copy(p2);
    dimSub.add(pt2);

    // Midpoint marker
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const midMarker = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.2), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
    midMarker.position.copy(mid);
    midMarker.position.y += 0.4;
    dimSub.add(midMarker);

    const midLine = new THREE.LineSegments(
      new THREE.EdgesGeometry(midMarker.geometry),
      new THREE.LineBasicMaterial({ color: 0x0088EA })
    );
    midMarker.add(midLine);

    return dimSub;
  }

  // Pre-configured survey measurements between buildings
  const dim1 = createDimensionLine(new THREE.Vector3(-7, 9.2, -5), new THREE.Vector3(5, 5.5, -8), "Span: 38.4m");
  const dim2 = createDimensionLine(new THREE.Vector3(5, 0.8, -8), new THREE.Vector3(5, 5.5, -8), "Height: 4.7m");
  const dim3 = createDimensionLine(new THREE.Vector3(-11, 0.6, 7), new THREE.Vector3(10, 1.0, 6), "Baseline: 42.0m");
  measureGroup.add(dim1);
  measureGroup.add(dim2);
  measureGroup.add(dim3);

  // --- 2. Pin Mode Visuals (Survey Beacons & Coordinate Markers) ---
  const pinGroup = new THREE.Group();
  pinGroup.visible = false;
  toolsGroup.add(pinGroup);

  const activePins = [];

  function addSurveyPin(pos, code, elev) {
    const pSub = new THREE.Group();
    pSub.position.copy(pos);

    // Surveyor pole
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8);
    const poleMat = new THREE.MeshBasicMaterial({ color: 0x0088EA });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 1.6;
    pSub.add(pole);

    // Prism sphere top
    const prismGeo = new THREE.SphereGeometry(0.45, 12, 12);
    const prismMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.2 });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.position.y = 3.3;
    pSub.add(prism);

    // Concentric pulsing ground ring
    const ringG = new THREE.RingGeometry(0.8, 1.0, 20);
    ringG.rotateX(-Math.PI / 2);
    const ringM = new THREE.MeshBasicMaterial({ color: 0x0088EA, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    const pulseRing = new THREE.Mesh(ringG, ringM);
    pulseRing.position.y = 0.05;
    pSub.add(pulseRing);

    // Floating Coordinate Chip
    const chipGeo = new THREE.BoxGeometry(2.4, 0.6, 0.15);
    const chipMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const chip = new THREE.Mesh(chipGeo, chipMat);
    chip.position.set(0, 3.8, 0);
    pSub.add(chip);

    const chipEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(chipGeo),
      new THREE.LineBasicMaterial({ color: 0x0088EA })
    );
    chip.add(chipEdge);

    pinGroup.add(pSub);
    activePins.push({ group: pSub, ring: pulseRing, baseScale: 1 });
  }

  // Pre-configured geodetic survey pins
  addSurveyPin(new THREE.Vector3(-10, 1.8, -4), "GCP-01", "214.2m");
  addSurveyPin(new THREE.Vector3(7, 1.6, -6), "GCP-02", "216.8m");
  addSurveyPin(new THREE.Vector3(9, 1.4, 8), "BM-01", "212.5m");

  // Active Tool Mode Management
  let currentToolMode = 'hand'; // 'hand' | 'measure' | 'pin'

  window.setHeroToolMode = function (tool) {
    currentToolMode = tool;
    if (tool === 'hand') {
      if (controls) controls.enabled = true;
      container.style.cursor = 'grab';
      measureGroup.visible = false;
      pinGroup.visible = false;
    } else if (tool === 'measure') {
      if (controls) controls.enabled = true;
      container.style.cursor = 'crosshair';
      measureGroup.visible = true;
      pinGroup.visible = false;
    } else if (tool === 'pin') {
      if (controls) controls.enabled = true;
      container.style.cursor = 'crosshair';
      measureGroup.visible = false;
      pinGroup.visible = true;
    }
  };

  // Raycaster for interactive user clicks in Measure and Pin modes
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  let measureClickStart = null;

  renderer.domElement.addEventListener('pointerdown', (e) => {
    if (currentToolMode === 'hand') return;

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([terrainMesh, structuresGroup], true);

    if (intersects.length > 0) {
      const hitPoint = intersects[0].point;

      if (currentToolMode === 'pin') {
        // Drop a new survey pin right where clicked!
        const lat = (12.9716 + (hitPoint.z * 0.0002)).toFixed(4);
        const lon = (77.5946 + (hitPoint.x * 0.0002)).toFixed(4);
        addSurveyPin(hitPoint, `P-${activePins.length + 1}`, `${(210 + hitPoint.y).toFixed(1)}m`);
      } else if (currentToolMode === 'measure') {
        if (!measureClickStart) {
          measureClickStart = hitPoint.clone();
        } else {
          // Connect measured distance
          const newDim = createDimensionLine(measureClickStart, hitPoint, "Measure");
          measureGroup.add(newDim);
          measureClickStart = null;
        }
      }
    }
  });

  // 3D View Modes (Surface, Point Cloud, Contours, Mesh)
  window.setHero3DMode = function (mode) {
    if (mode === 'surface') {
      terrainMat.wireframe = false;
      terrainMat.color.setHex(0xEEF8FC);
      wireMesh.visible = true;
      pointCloud.visible = true;
      structuresGroup.visible = true;
    } else if (mode === 'points') {
      terrainMat.wireframe = false;
      wireMesh.visible = false;
      structuresGroup.visible = false;
      pointCloud.visible = true;
    } else if (mode === 'contours') {
      terrainMat.wireframe = true;
      terrainMat.color.setHex(0xBAE6FD);
      wireMesh.visible = true;
      structuresGroup.visible = true;
      pointCloud.visible = false;
    } else if (mode === 'mesh') {
      terrainMat.wireframe = true;
      terrainMat.color.setHex(0x0088EA);
      wireMesh.visible = false;
      structuresGroup.visible = true;
      pointCloud.visible = true;
    }
  };

  // Performance Optimization: IntersectionObserver (Pauses loop when off-screen)
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.05 });
  observer.observe(container);

  let flightTime = 0;
  let lastTime = performance.now();
  let pulseTime = 0;

  function animate(now) {
    requestAnimationFrame(animate);
    if (!isVisible) return; // Zero GPU/CPU load when scrolled off-screen!

    const delta = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    flightTime += delta * 0.35;
    const loop = flightTime % (Math.PI * 4);
    const targetX = Math.sin(loop * 0.5) * 12;
    const targetZ = Math.cos(loop * 0.25) * 10;
    const targetY = 13 + Math.sin(loop * 1.2) * 0.6;

    drone.position.x = targetX;
    drone.position.z = targetZ;
    drone.position.y = targetY;

    drone.rotation.z = -Math.cos(loop * 0.5) * 0.06;
    drone.rotation.x = Math.sin(loop * 0.25) * 0.05;

    rotorBlades.forEach((blade, idx) => {
      blade.rotation.y += (idx % 2 === 0 ? 0.35 : -0.35);
    });

    scanRing.position.x = drone.position.x;
    scanRing.position.z = drone.position.z;
    scanRing.position.y = 0.15;
    scanRing.rotation.z += 0.01;

    // Pulse survey pins if active
    if (pinGroup.visible && activePins.length > 0) {
      pulseTime += delta * 3;
      const s = 1 + Math.sin(pulseTime) * 0.2;
      activePins.forEach(p => {
        p.ring.scale.set(s, s, s);
      });
    }

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
