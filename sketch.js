// --- Asset variables ---
let menuBg;
let avatars = {};
let gameState = 'menu'; // 'menu', 'almanac', or 'game'
let almanacButton, startGameButton;
let selectedZombie = null;
let sunCount = 50; // Starting suns

// Sun drop mechanic
let suns = [];
let sunDropTimer = 0;
let sunDropInterval = 120; // frames between sun drops (2 seconds at 60fps)
const MAX_SUNS = 5;

const SUN_TYPES = [
  { name: 'small', value: 5, radius: 20, weight: 0.7 },      // 70% chance
  { name: 'big', value: 25, radius: 32, weight: 0.28 },      // 28% chance
  { name: 'enormous', value: 100, radius: 48, weight: 0.02 } // 2% chance
];

const avatarFiles = [
  { name: 'drummer', file: 'drummer.png', display: 'Drummer Zombie', type: 'zombie' },
  { name: 'onion', file: 'onion.png', display: 'Onion Zombie', type: 'zombie' },
  { name: 'blueberries', file: 'blueberries.png', display: 'Blueberries Zombie', type: 'zombie' },
  { name: 'nurse', file: 'nurse.png', display: 'Nurse Zombie', type: 'zombie' },
];

// --- Plant definitions ---
const plantTypes = [
  {
    name: 'sunflower',
    display: 'Sunflower',
    avatar: 'sunflower', // key in avatars
    cost: 100
    // In the future, add: image, description, etc.
  },
  {
    name: 'double',
    display: 'Double Plant',
    avatar: 'double',
    cost: 150
  },
  {
    name: 'snow',
    display: 'Snow Plant',
    avatar: 'snow',
    cost: 200
  },
  {
    name: 'slide',
    display: 'Slide Plant',
    avatar: 'slide',
    cost: 175
  },
  {
    name: 'tshirt',
    display: 'T-Shirt Plant',
    avatar: 'tshirt',
    cost: 125
  }
  // Add more plants here
];
let selectedPlantType = null;
let planted = []; // Array of {type, row, col}

function preload() {
  menuBg = loadImage('assets/images/menu/background.png');
  // Load zombie avatars
  for (let av of avatarFiles) {
    if (av.type === 'zombie') {
      avatars[av.name] = loadImage('assets/images/avatars/zombies/' + av.file);
    }
  }
  // Load plant avatars
  for (let plant of plantTypes) {
    avatars[plant.avatar] = loadImage('assets/images/avatars/plants/' + plant.avatar + '.png');
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupMenuButtons();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupMenuButtons();
}

function setupMenuButtons() {
  // Almanac button
  if (!almanacButton) {
    almanacButton = createButton('Open Almanac');
    almanacButton.mousePressed(() => {
      gameState = 'almanac';
      almanacButton.hide();
      startGameButton.hide();
    });
    almanacButton.style('font-size', '18px');
    almanacButton.style('border-radius', '8px');
    almanacButton.style('background', '#fff');
    almanacButton.style('border', '2px solid #444');
    almanacButton.style('cursor', 'pointer');
  }
  almanacButton.size(Math.max(120, windowWidth * 0.12), 40);
  almanacButton.position(windowWidth / 2 - almanacButton.width - 20, windowHeight - 100);

  // Start Game button
  if (!startGameButton) {
    startGameButton = createButton('Start Game');
    startGameButton.mousePressed(() => {
      gameState = 'game';
      almanacButton.hide();
      startGameButton.hide();
      resetGame();
    });
    startGameButton.style('font-size', '18px');
    startGameButton.style('border-radius', '8px');
    startGameButton.style('background', '#fff');
    startGameButton.style('border', '2px solid #444');
    startGameButton.style('cursor', 'pointer');
  }
  startGameButton.size(Math.max(120, windowWidth * 0.12), 40);
  startGameButton.position(windowWidth / 2 + 20, windowHeight - 100);
}

function resetGame() {
  sunCount = 50;
  suns = [];
  sunDropTimer = 0;
  selectedPlantType = null;
  planted = [];
}

function draw() {
  if (gameState === 'menu') {
    drawMenu();
  } else if (gameState === 'almanac') {
    drawAlmanac();
  } else if (gameState === 'game') {
    drawGame();
  }
}

function drawMenu() {
  background(34, 139, 34);
  image(menuBg, 0, 0, width, height);
  fill(255);
  textAlign(CENTER, TOP);
  textSize(Math.max(32, width * 0.05));
  text('Plants vs Zombies 10', width / 2, 40);
  almanacButton.show();
  startGameButton.show();
}

function drawAlmanac() {
  background(30);
  let margin = Math.max(20, width * 0.03);
  let gridX = margin, gridY = margin, gridW = Math.max(320, width * 0.45), gridH = height - margin * 2;
  let cols = 2, rows = Math.ceil(avatarFiles.length / cols);
  let cellW = Math.max(100, gridW / cols - margin), cellH = Math.max(100, (gridH - (rows - 1) * margin) / rows);
  let pad = margin;
  for (let i = 0; i < avatarFiles.length; i++) {
    let col = i % cols;
    let row = Math.floor(i / cols);
    let x = gridX + col * (cellW + pad);
    let y = gridY + row * (cellH + pad);
    let av = avatarFiles[i];
    if (selectedZombie === av.name) {
      stroke(255, 215, 0);
      strokeWeight(4);
    } else {
      noStroke();
    }
    fill(50);
    rect(x - 8, y - 8, cellW + 16, cellH + 16, 16);
    image(avatars[av.name], x, y, cellW, cellH);
    noStroke();
    fill(255);
    textAlign(CENTER, TOP);
    textSize(Math.max(14, cellW * 0.13));
    text(av.display, x + cellW / 2, y + cellH + 4);
  }
  let paneX = gridX + gridW + margin;
  fill(40);
  stroke(80);
  rect(paneX, gridY, width - paneX - margin, gridH, 16);
  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  textSize(Math.max(22, width * 0.025));
  text('Zombie Details', paneX + 24, gridY + 24);
  if (selectedZombie) {
    let av = avatarFiles.find(a => a.name === selectedZombie);
    image(avatars[av.name], paneX + 24, gridY + 70, Math.max(60, width * 0.06), Math.max(60, width * 0.06));
    textSize(Math.max(18, width * 0.018));
    text(av.display, paneX + 120, gridY + 80);
    textSize(Math.max(14, width * 0.013));
    text('Description: (Add details here)', paneX + 24, gridY + 170, width - paneX - 80, 200);
  } else {
    textSize(Math.max(16, width * 0.015));
    text('Select a zombie from the grid to see details.', paneX + 24, gridY + 70, width - paneX - 80, 200);
  }
  drawBackButton();
}

function drawGame() {
  background(34, 139, 34);
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
  let sunPanelW = panelW;
  let sunPanelH = 50;
  let sunPanelX = margin;
  let sunPanelY = margin - sunPanelH - 10;
  if (sunPanelY < 0) sunPanelY = 0;
  fill(255, 230, 120);
  rect(sunPanelX, sunPanelY, sunPanelW, sunPanelH, 16);
  fill(80, 60, 0);
  textAlign(CENTER, CENTER);
  textSize(Math.max(20, sunPanelH * 0.5));
  text('☀ ' + sunCount, sunPanelX + sunPanelW / 2, sunPanelY + sunPanelH / 2);

  // Draw left panel (for plant selection)
  fill(60, 120, 60);
  rect(margin, margin, panelW, gridH, 18);
  fill(255);
  textAlign(CENTER, TOP);
  textSize(Math.max(18, panelW * 0.18));
  text('Plants', margin + panelW / 2, margin + 16);

  // Draw plant inventory (vertical list)
  let plantIconSize = Math.max(60, panelW * 0.7);
  let plantPad = 24;
  for (let i = 0; i < plantTypes.length; i++) {
    let px = margin + panelW / 2;
    let py = margin + 60 + i * (plantIconSize + plantPad);
    let plant = plantTypes[i];
    // Highlight if selected
    if (selectedPlantType && selectedPlantType.name === plant.name) {
      stroke(255, 215, 0);
      strokeWeight(4);
    } else {
      noStroke();
    }
    fill(80, 180, 80);
    rect(px - plantIconSize / 2 - 8, py - 8, plantIconSize + 16, plantIconSize + 16, 16);
    image(avatars[plant.avatar], px - plantIconSize / 2, py, plantIconSize, plantIconSize);
    noStroke();
    fill(255);
    textAlign(CENTER, TOP);
    textSize(Math.max(16, plantIconSize * 0.22));
    text(plant.display, px, py + plantIconSize + 2);
    textSize(Math.max(14, plantIconSize * 0.18));
    text('Cost: ' + plant.cost, px, py + plantIconSize + 26);
    // Gray overlay if not enough suns
    if (sunCount < plant.cost) {
      fill(0, 0, 0, 120);
      rect(px - plantIconSize / 2, py, plantIconSize, plantIconSize, 12);
    }
  }

  // Draw checkerboard grid
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let x = gridX + c * cellW;
      let y = gridY + r * cellH;
      if ((r + c) % 2 === 0) {
        fill(80, 160, 80);
      } else {
        fill(60, 140, 60);
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

  // --- SUN DROP MECHANIC ---
  if (frameCount > 1) {
    sunDropTimer--;
    if (sunDropTimer <= 0 && suns.length < MAX_SUNS) {
      spawnSun(gridX, gridY, gridW, gridH);
      sunDropTimer = sunDropInterval + int(random(-30, 60)); // randomize interval
    }
  }
  // Update and draw suns
  for (let i = suns.length - 1; i >= 0; i--) {
    let sun = suns[i];
    sun.update();
    sun.draw();
    if (sun.collected) {
      suns.splice(i, 1);
    }
  }
}

function spawnSun(gridX, gridY, gridW, gridH) {
  // Weighted random selection for sun type
  let r = random();
  let acc = 0;
  let type = SUN_TYPES[0];
  for (let i = 0; i < SUN_TYPES.length; i++) {
    acc += SUN_TYPES[i].weight;
    if (r < acc) {
      type = SUN_TYPES[i];
      break;
    }
  }
  let x = gridX + random(0, gridW);
  let targetY = gridY + random(0, gridH);
  suns.push(new Sun(x, -type.radius * 2, x, targetY, type));
}

class Sun {
  constructor(x, y, targetX, targetY, type) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.type = type;
    this.radius = Math.max(type.radius, width * 0.018 * (type.radius / 20));
    this.speed = Math.max(2, height * 0.008);
    this.landed = false;
    this.collected = false;
  }
  update() {
    if (!this.landed) {
      let dy = this.targetY - this.y;
      if (abs(dy) < this.speed) {
        this.y = this.targetY;
        this.landed = true;
      } else {
        this.y += this.speed;
      }
    }
  }
  draw() {
    fill(255, 230, 60);
    stroke(255, 200, 0);
    strokeWeight(3);
    ellipse(this.x, this.y, this.radius * 2);
    noStroke();
    // Optionally, add a visual indicator for big/enormous suns
    if (this.type.name === 'enormous') {
      stroke(255, 100, 0);
      strokeWeight(4);
      noFill();
      ellipse(this.x, this.y, this.radius * 2.5);
      noStroke();
    } else if (this.type.name === 'big') {
      stroke(255, 180, 0);
      strokeWeight(3);
      noFill();
      ellipse(this.x, this.y, this.radius * 2.2);
      noStroke();
    }
  }
  isUnderMouse(mx, my) {
    return dist(mx, my, this.x, this.y) < this.radius;
  }
}

function mousePressed() {
  if (gameState === 'almanac') {
    let margin = Math.max(20, width * 0.03);
    let gridX = margin, gridY = margin, gridW = Math.max(320, width * 0.45), gridH = height - margin * 2;
    let cols = 2, cellW = Math.max(100, gridW / cols - margin), cellH = Math.max(100, (gridH - (Math.ceil(avatarFiles.length / cols) - 1) * margin) / Math.ceil(avatarFiles.length / cols)), pad = margin;
    for (let i = 0; i < avatarFiles.length; i++) {
      let col = i % cols;
      let row = Math.floor(i / cols);
      let x = gridX + col * (cellW + pad);
      let y = gridY + row * (cellH + pad);
      if (
        mouseX > x && mouseX < x + cellW &&
        mouseY > y && mouseY < y + cellH
      ) {
        selectedZombie = avatarFiles[i].name;
        return;
      }
    }
    if (mouseX > width - Math.max(120, width * 0.12) && mouseY > height - 60) {
      gameState = 'menu';
      almanacButton.show();
      startGameButton.show();
      selectedZombie = null;
    }
  } else if (gameState === 'game') {
    // Check for sun collection
    for (let i = suns.length - 1; i >= 0; i--) {
      if (suns[i].isUnderMouse(mouseX, mouseY)) {
        sunCount += suns[i].type.value;
        suns[i].collected = true;
        return;
      }
    }
    // Check for plant selection
    let margin = Math.max(20, width * 0.03);
    let panelW = Math.max(120, width * 0.13);
    let plantIconSize = Math.max(60, panelW * 0.7);
    let plantPad = 24;
    for (let i = 0; i < plantTypes.length; i++) {
      let px = margin + panelW / 2;
      let py = margin + 60 + i * (plantIconSize + plantPad);
      if (
        mouseX > px - plantIconSize / 2 && mouseX < px + plantIconSize / 2 &&
        mouseY > py && mouseY < py + plantIconSize
      ) {
        if (sunCount >= plantTypes[i].cost) {
          selectedPlantType = plantTypes[i];
        }
        return;
      }
    }
    // Check for planting on grid
    if (selectedPlantType) {
      let gridW = width - panelW - margin * 3;
      let gridH = height - margin * 2;
      let rows = 5, cols = 10;
      let cellW = gridW / cols;
      let cellH = gridH / rows;
      let gridX = panelW + margin * 2;
      let gridY = margin;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let x = gridX + c * cellW;
          let y = gridY + r * cellH;
          if (
            mouseX > x && mouseX < x + cellW &&
            mouseY > y && mouseY < y + cellH
          ) {
            // Check if cell is empty
            let occupied = planted.some(p => p.row === r && p.col === c);
            if (!occupied && sunCount >= selectedPlantType.cost) {
              planted.push({ type: selectedPlantType.name, row: r, col: c });
              sunCount -= selectedPlantType.cost;
              selectedPlantType = null;
            }
            return;
          }
        }
      }
    }
  }
}

function drawBackButton() {
  let bw = Math.max(100, width * 0.10), bh = 40;
  let bx = width - bw - 20, by = height - bh - 20;
  fill(200, 60, 60);
  rect(bx, by, bw, bh, 12);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(Math.max(20, width * 0.018));
  text('Back', bx + bw / 2, by + bh / 2);
} 