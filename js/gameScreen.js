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
  
  // Zombie system
  if (!gameOver) {
    updateAndDrawZombies(gridX, gridY, cellW, cellH);
    spawnZombies(gridX, gridY, cellW, cellH);
  } else {
    drawGameOver();
  }
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

// Zombie System Functions
function spawnZombies(gridX, gridY, cellW, cellH) {
  zombieSpawnTimer++;
  if (zombieSpawnTimer >= zombieSpawnInterval) {
    zombieSpawnTimer = 0;
    
    // Randomly select a row (0-4)
    let row = Math.floor(Math.random() * 5);
    let y = gridY + row * cellH;
    
    // Spawn zombie on the right side of the screen
    let zombie = {
      x: width - 50, // Start from right side
      y: y + cellH * 0.1, // Slightly offset from grid
      row: row,
      speed: 0.5, // Pixels per frame
      health: 3, // Start with 3 health
      type: 'nurse',
      hitTimer: 0, // Timer for hit flash effect
      hitFlashDuration: 10 // Flash for 10 frames
    };
    
    zombies.push(zombie);
    console.log('Zombie spawned at row:', row);
  }
}

function updateAndDrawZombies(gridX, gridY, cellW, cellH) {
  for (let i = zombies.length - 1; i >= 0; i--) {
    let zombie = zombies[i];
    
    // Move zombie to the left
    zombie.x -= zombie.speed;
    
    // Check if zombie reached the house (left side of grid)
    if (zombie.x <= gridX) {
      console.log('Zombie reached the house! Game Over!');
      gameOver = true;
      return;
    }
    
    // Update hit flash timer
    if (zombie.hitTimer > 0) {
      zombie.hitTimer--;
    }
    
    // Draw zombie with hit flash effect
    if (mapImages.nurseZombie) {
      push(); // Save current drawing state
      
      // Apply white tint if zombie was recently hit
      if (zombie.hitTimer > 0) {
        // Calculate flash intensity (stronger at start, fading out)
        let flashIntensity = map(zombie.hitTimer, 0, zombie.hitFlashDuration, 255, 0);
        tint(255, 255, 255, flashIntensity);
      }
      
      image(mapImages.nurseZombie, zombie.x, zombie.y, cellW * 0.8, cellH * 0.8);
      pop(); // Restore drawing state
    } else {
      // Fallback: draw a simple zombie shape
      if (zombie.hitTimer > 0) {
        fill(255, 255, 255); // White when hit
      } else {
        fill(100, 200, 100); // Normal color
      }
      rect(zombie.x, zombie.y, cellW * 0.8, cellH * 0.8);
    }
    
    // Check collision with peas
    checkZombiePeaCollision(zombie, i, cellW, cellH);
  }
}

function checkZombiePeaCollision(zombie, zombieIndex, cellW, cellH) {
  for (let j = peas.length - 1; j >= 0; j--) {
    let pea = peas[j];
    
    // Get zombie dimensions (using the same size as drawn)
    let zombieWidth = cellW * 0.8; // Same as drawn zombie size
    let zombieHeight = cellH * 0.8;
    
    // Proper collision detection using actual pea size
    if (pea.x < zombie.x + zombieWidth && pea.x + pea.size > zombie.x &&
        pea.y < zombie.y + zombieHeight && pea.y + pea.size > zombie.y) {
      
      console.log('Pea hit zombie! Pea at:', pea.x, pea.y, 'Zombie at:', zombie.x, zombie.y);
      
      // Remove pea
      peas.splice(j, 1);
      
      // Reduce zombie health
      zombie.health -= 1;
      
      // Trigger hit flash effect
      zombie.hitTimer = zombie.hitFlashDuration;
      
      console.log('Zombie health reduced to:', zombie.health);
      
      // Remove zombie if health is 0 or below
      if (zombie.health <= 0) {
        zombies.splice(zombieIndex, 1);
        console.log('Zombie defeated!');
        return;
      }
    }
  }
}



function drawGameOver() {
  // Semi-transparent overlay
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  
  // Game over text
  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(Math.max(48, width * 0.08));
  text('GAME OVER', width / 2, height / 2 - 50);
  
  // Instructions
  fill(255);
  textSize(Math.max(24, width * 0.04));
  text('Click anywhere to return to map selection', width / 2, height / 2 + 50);
  
  // Hide the exit button during game over
  if (exitButton) {
    exitButton.hide();
  }
} 