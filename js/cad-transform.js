/* ==========================================================================
   OQLO.AI - Section 6: 3D Model to CAD Linework Transformation
   Interactive comparison slider: 3D Model -> Technical CAD linework (.DXF / .DWG)
   ========================================================================== */

(function () {
  const slider = document.getElementById('cad-slider');
  const divider = document.getElementById('cad-divider');
  const cadOverlay = document.getElementById('cad-overlay-layer');
  const container = document.getElementById('cad-stage-container');

  if (!slider || !cadOverlay || !container) return;

  function updateCadSplit(val) {
    const pct = Math.max(0, Math.min(100, val));
    cadOverlay.style.width = pct + '%';
    if (divider) divider.style.left = pct + '%';
  }

  slider.addEventListener('input', (e) => {
    updateCadSplit(e.target.value);
  });

  // Support direct mouse dragging on container
  let isDragging = false;

  container.addEventListener('pointerdown', (e) => {
    isDragging = true;
    handlePointer(e);
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    handlePointer(e);
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
  });

  function handlePointer(e) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = (x / rect.width) * 100;
    if (slider) slider.value = pct;
    updateCadSplit(pct);
  }

  // Initial position at 50%
  updateCadSplit(50);
})();
