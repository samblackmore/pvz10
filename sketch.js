// --- Asset variables ---
let menuBg;
let avatars = {};
let gameState = 'menu'; // 'menu' or 'almanac'
let almanacButton;
let selectedZombie = null;

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
  setupAlmanacButton();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupAlmanacButton();
}

function setupAlmanacButton() {
  if (!almanacButton) {
    almanacButton = createButton('Open Almanac');
    almanacButton.mousePressed(() => {
      gameState = 'almanac';
      almanacButton.hide();
    });
    almanacButton.style('font-size', '18px');
    almanacButton.style('border-radius', '8px');
    almanacButton.style('background', '#fff');
    almanacButton.style('border', '2px solid #444');
    almanacButton.style('cursor', 'pointer');
  }
  almanacButton.size(Math.max(120, windowWidth * 0.12), 40);
  almanacButton.position(windowWidth / 2 - almanacButton.width / 2, windowHeight - 100);
}

function draw() {
  if (gameState === 'menu') {
    drawMenu();
  } else if (gameState === 'almanac') {
    drawAlmanac();
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
}

function drawAlmanac() {
  background(30);
  // Responsive grid and pane
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
    // Highlight if selected
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
  // Details pane on the right
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
  // Back button
  drawBackButton();
}

function mousePressed() {
  if (gameState === 'almanac') {
    // Check if clicked on an avatar
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
    // Check if clicked back
    if (mouseX > width - Math.max(120, width * 0.12) && mouseY > height - 60) {
      gameState = 'menu';
      almanacButton.show();
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