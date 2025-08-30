// Game State Management
let gameState = 'menu'; // 'menu', 'almanac', 'mapselect', or 'game'
let selectedZombie = null;
let selectedPlantType = null;

function resetGame() {
  sunCount = 50;
  suns = [];
  sunDropTimer = 0;
  selectedPlantType = null;
  planted = [];
  peas = [];
  // Note: selectedMap is not reset here as it should persist between game sessions
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