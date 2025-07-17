// --- Asset variables ---
let menuBg;
let avatars = {};
let gameState = 'menu'; // 'menu', 'almanac', or 'game'
let almanacButton, startGameButton;
let selectedZombie = null;
let sunCount = 50; // Starting suns

const avatarFiles = [
  { name: 'drummer', file: 'drummer.png', display: 'Drummer Zombie' },
  { name: 'onion', file: 'onion.png', display: 'Onion Zombie' },
  { name: 'blueberries', file: 'blueberries.png', display: 'Blueberries Zombie' },
  { name: 'nurse', file: 'nurse.png', display: 'Nurse Zombie' },
];

function preload() {
  menuBg = loadImage('assets/images/menu/background.png');
  for (let av of avatarFiles) {
    avatars[av.name] = loadImage('assets/images/avatars/' + av.file);
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

  // Draw left panel (for plant selection)
  fill(60, 120, 60);
  rect(margin, margin, panelW, gridH, 18);
  fill(255);
  textAlign(CENTER, TOP);
  textSize(Math.max(18, panelW * 0.18));
  text('Plants', margin + panelW / 2, margin + 16);
  // (Plant icons will go here in the future)

  // Draw sun counter at top
  let sunPanelW = Math.max(120, width * 0.13);
  let sunPanelH = 50;
  fill(255, 230, 120);
  rect(width - sunPanelW - margin, margin, sunPanelW, sunPanelH, 16);
  fill(80, 60, 0);
  textAlign(CENTER, CENTER);
  textSize(Math.max(20, sunPanelH * 0.5));
  text('☀ ' + sunCount, width - sunPanelW / 2 - margin, margin + sunPanelH / 2);

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
    }
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