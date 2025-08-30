// Game Screen
let exitButton;

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
  
  // Draw exit button
  drawExitButton();
}

function drawExitButton() {
  // Create exit button if it doesn't exist
  if (!exitButton) {
    exitButton = createButton('Exit to Map Selection');
    exitButton.mousePressed(() => {
      console.log('Exit button clicked, returning to map selection');
      gameState = 'mapselect';
      // Reset the game state but keep the selected map
      resetGame();
      // Hide the exit button
      exitButton.hide();
    });
    exitButton.style('font-size', '16px');
    exitButton.style('border-radius', '8px');
    exitButton.style('background', '#ff6b6b');
    exitButton.style('border', '2px solid #d63031');
    exitButton.style('color', 'white');
    exitButton.style('cursor', 'pointer');
  }
  
  // Position and size the button
  let buttonWidth = Math.max(150, width * 0.12);
  let buttonHeight = 40;
  exitButton.size(buttonWidth, buttonHeight);
  exitButton.position(width - buttonWidth - 20, 20); // Top right corner
  
  // Show the button
  exitButton.show();
}

// Function to hide the exit button (called when leaving game state)
function hideExitButton() {
  if (exitButton) {
    exitButton.hide();
  }
} 