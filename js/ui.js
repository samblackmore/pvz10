// UI System
let almanacButton, startGameButton;

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
      // Start music on first user interaction
      if (bgMusic && !bgMusic.isPlaying()) {
        bgMusic.loop();
        bgMusic.setVolume(0.5);
      }
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

function handlePlantSelection(mouseX, mouseY) {
  let margin = Math.max(20, width * 0.03);
  let panelW = Math.max(120, width * 0.13);
  let plantIconSize = Math.max(60, panelW * 0.7);
  let plantPad = 40;
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
      return true;
    }
  }
  return false;
}

function handlePlanting(mouseX, mouseY) {
  if (!selectedPlantType) return false;
  
  let margin = Math.max(20, width * 0.03);
  let panelW = Math.max(120, width * 0.13);
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
          planted.push({ 
            type: selectedPlantType.name, 
            row: r, 
            col: c, 
            shootTimer: 0 
          });
          sunCount -= selectedPlantType.cost;
          selectedPlantType = null;
          return true;
        }
        return false;
      }
    }
  }
  return false;
}

function handleAlmanacInteraction(mouseX, mouseY) {
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
      return true;
    }
  }
  // Check if clicked back
  if (mouseX > width - Math.max(120, width * 0.12) && mouseY > height - 60) {
    gameState = 'menu';
    almanacButton.show();
    startGameButton.show();
    selectedZombie = null;
    return true;
  }
  return false;
} 