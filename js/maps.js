// Maps System
const MAPS = [
  {
    name: 'halloween',
    display: 'Halloween',
    color: [139, 69, 19], // Brown
    gridColor1: [160, 82, 45], // Saddle brown
    gridColor2: [139, 69, 19], // Dark brown
    backgroundColor: [47, 79, 79] // Dark slate gray
  },
  {
    name: 'christmas',
    display: 'Christmas Day',
    color: [255, 0, 0], // Red
    gridColor1: [255, 20, 147], // Deep pink
    gridColor2: [220, 20, 60], // Crimson
    backgroundColor: [0, 100, 0] // Dark green
  },
  {
    name: 'northpole',
    display: 'North Pole',
    color: [255, 255, 255], // White
    gridColor1: [240, 248, 255], // Alice blue
    gridColor2: [255, 250, 250], // Snow
    backgroundColor: [70, 130, 180] // Steel blue
  },
  {
    name: 'night',
    display: 'Night Time',
    color: [25, 25, 112], // Midnight blue
    gridColor1: [72, 61, 139], // Dark slate blue
    gridColor2: [25, 25, 112], // Midnight blue
    backgroundColor: [0, 0, 0] // Black
  },
  {
    name: 'roof',
    display: 'Roof',
    color: [128, 128, 128], // Gray
    gridColor1: [169, 169, 169], // Dark gray
    gridColor2: [105, 105, 105], // Dim gray
    backgroundColor: [47, 79, 79] // Dark slate gray
  },
  {
    name: 'day',
    display: 'Day',
    color: [34, 139, 34], // Forest green
    gridColor1: [80, 160, 80], // Light green
    gridColor2: [60, 140, 60], // Dark green
    backgroundColor: [34, 139, 34] // Forest green
  }
];

let selectedMap = null;

function drawMapSelect() {
  background(30);
  
  // Title
  fill(255);
  textAlign(CENTER, TOP);
  textSize(Math.max(32, width * 0.05));
  text('Select a Map', width / 2, 40);
  
  // Calculate grid layout
  let margin = Math.max(20, width * 0.03);
  let cols = 3;
  let rows = Math.ceil(MAPS.length / cols);
  let mapWidth = Math.max(200, (width - margin * (cols + 1)) / cols);
  let mapHeight = Math.max(150, (height - margin * (rows + 2) - 80) / rows);
  
  // Draw map buttons
  for (let i = 0; i < MAPS.length; i++) {
    let col = i % cols;
    let row = Math.floor(i / cols);
    let x = margin + col * (mapWidth + margin);
    let y = margin + 80 + row * (mapHeight + margin);
    
    let map = MAPS[i];
    
    // Map button background
    if (map.name === 'night' && mapImages.fireworks) {
      image(mapImages.fireworks, x, y, mapWidth, mapHeight);
    } else if (map.name === 'christmas' && mapImages.christmas) {
      image(mapImages.christmas, x, y, mapWidth, mapHeight);
    } else {
      fill(map.color[0], map.color[1], map.color[2]);
      stroke(255);
      strokeWeight(2);
      rect(x, y, mapWidth, mapHeight, 12);
      noStroke();
    }
    
    // Map name
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(Math.max(18, mapWidth * 0.12));
    text(map.display, x + mapWidth / 2, y + mapHeight / 2);
  }
  
  // Back button
  drawBackButton();
}

function handleMapSelection(mouseX, mouseY) {
  // Only handle map selection if we're in the mapselect state
  if (gameState !== 'mapselect') {
    console.log('Not in mapselect state, ignoring map selection');
    return false;
  }
  
  // Don't handle map selection if a button was just clicked
  if (typeof buttonJustClicked !== 'undefined' && buttonJustClicked) {
    console.log('Button just clicked, ignoring map selection');
    return false;
  }
  
  console.log('Button just clicked flag:', buttonJustClicked);
  
  let margin = Math.max(20, width * 0.03);
  let cols = 3;
  let rows = Math.ceil(MAPS.length / cols);
  let mapWidth = Math.max(200, (width - margin * (cols + 1)) / cols);
  let mapHeight = Math.max(150, (height - margin * (rows + 2) - 80) / rows);
  
  console.log('Map selection check - mouse at:', mouseX, mouseY);
  
  for (let i = 0; i < MAPS.length; i++) {
    let col = i % cols;
    let row = Math.floor(i / cols);
    let x = margin + col * (mapWidth + margin);
    let y = margin + 80 + row * (mapHeight + margin);
    
    console.log('Map', i, MAPS[i].name, 'at position:', x, y, 'size:', mapWidth, mapHeight);
    
    if (
      mouseX > x && mouseX < x + mapWidth &&
      mouseY > y && mouseY < y + mapHeight
    ) {
      console.log('Map selected:', MAPS[i].name, 'setting gameState to game');
      selectedMap = MAPS[i];
      gameState = 'game';
      resetGame();
      // Start music on first user interaction
      if (bgMusic && !bgMusic.isPlaying()) {
        bgMusic.loop();
        bgMusic.setVolume(0.5);
      }
      return true;
    }
  }
  
  // Check if clicked back
  if (mouseX > width - Math.max(120, width * 0.12) && mouseY > height - 60) {
    gameState = 'menu';
    almanacButton.show();
    startGameButton.show();
    return true;
  }
  
  return false;
}

function getCurrentMap() {
  // If no map is selected, default to the 'day' map (index 5)
  if (!selectedMap) {
    selectedMap = MAPS[5]; // Default to 'day' map
  }
  return selectedMap;
}

function drawMapBackground() {
  let map = getCurrentMap();
  background(map.backgroundColor[0], map.backgroundColor[1], map.backgroundColor[2]);
}

function drawMapGrid(gridX, gridY, cellW, cellH) {
  let map = getCurrentMap();
  
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 10; c++) {
      let x = gridX + c * cellW;
      let y = gridY + r * cellH;
      if ((r + c) % 2 === 0) {
        fill(map.gridColor1[0], map.gridColor1[1], map.gridColor1[2]);
      } else {
        fill(map.gridColor2[0], map.gridColor2[1], map.gridColor2[2]);
      }
      rect(x, y, cellW, cellH);
      // Draw plant if present
      let plantHere = planted.find(p => p.row === r && p.col === c);
      if (plantHere) {
        let plant = plantTypes.find(pt => pt.name === plantHere.type);
        image(avatars[plant.avatar], x + cellW * 0.1, y + cellH * 0.1, cellW * 0.8, cellH * 0.8);
      }
    }
  }
} 