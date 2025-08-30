// Game Screen
function drawGame() {
  // Use map-specific background
  drawMapBackground();
  
  // Layout constants
  let margin = Math.max(20, width * 0.03);
  let panelW = Math.max(120, width * 0.13);
  let gridW = width - panelW - margin * 3;
  let gridH = height - margin * 2;
  let rows = 5, cols = 10;
  let cellW = gridW / cols;
  let cellH = gridH / rows;
  let gridX = panelW + margin * 2;
  let gridY = margin;

  // Draw sun counter above plant panel
  drawSunCounter(margin, panelW);

  // Draw plant panel
  drawPlantPanel(margin, panelW, gridH);

  // Draw planted plants and grid
  drawPlantedPlants(gridX, gridY, cellW, cellH);

  // Update and draw peas
  updateAndDrawPeas();

  // Update plant shooting
  updatePlantShooting(gridX, gridY, cellW, cellH);

  // Update sun drops
  updateSunDrops(gridX, gridY, gridW, gridH);
  
  // Update and draw suns
  updateAndDrawSuns();
} 