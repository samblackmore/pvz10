// Plant System
const plantTypes = [
  {
    name: 'sunflower',
    display: 'Sunflower',
    avatar: 'sunflower',
    cost: 100,
    shootFreq: 120, // frames between shots
    peaColor: [34, 139, 34], // green
    peaSize: 8
  },
  {
    name: 'double',
    display: 'Double Plant',
    avatar: 'double',
    cost: 150,
    shootFreq: 90, // faster shooting
    peaColor: [34, 139, 34], // green
    peaSize: 10
  },
  {
    name: 'snow',
    display: 'Snow Plant',
    avatar: 'snow',
    cost: 200,
    shootFreq: 150, // slower shooting
    peaColor: [240, 248, 255], // white/ice
    peaSize: 12
  },
  {
    name: 'slide',
    display: 'Slide Plant',
    avatar: 'slide',
    cost: 175,
    shootFreq: 100, // medium speed
    peaColor: [34, 139, 34], // green
    peaSize: 9
  },
  {
    name: 'tshirt',
    display: 'T-Shirt Plant',
    avatar: 'tshirt',
    cost: 125,
    shootFreq: 110, // medium speed
    peaColor: [34, 139, 34], // green
    peaSize: 8
  }
];

let planted = []; // Array of {type, row, col, shootTimer}
let peas = []; // Array of pea objects

function drawPlantPanel(margin, panelW, gridH) {
  // Draw left panel (for plant selection)
  fill(60, 120, 60);
  rect(margin, margin, panelW, gridH, 18);
  fill(255);
  textAlign(CENTER, TOP);
  textSize(Math.max(18, panelW * 0.18));
  text('Plants', margin + panelW / 2, margin + 16);

  // Draw plant inventory (vertical list)
  let plantIconSize = Math.max(60, panelW * 0.7);
  let plantPad = 40;
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
}

function drawPlantedPlants(gridX, gridY, cellW, cellH) {
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 10; c++) {
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
}

function updatePlantShooting(gridX, gridY, cellW, cellH) {
  for (let plant of planted) {
    if (!plant.shootTimer) {
      plant.shootTimer = 0;
    }
    plant.shootTimer++;
    
    let plantType = plantTypes.find(pt => pt.name === plant.type);
    if (plant.shootTimer >= plantType.shootFreq) {
      // Shoot a pea
      let peaX = gridX + plant.col * cellW + cellW * 0.8;
      let peaY = gridY + plant.row * cellH + cellH * 0.5;
      peas.push(new Pea(peaX, peaY, plantType.peaColor, plantType.peaSize));
      plant.shootTimer = 0;
    }
  }
}

function updateAndDrawPeas() {
  for (let i = peas.length - 1; i >= 0; i--) {
    peas[i].update();
    peas[i].draw();
    if (peas[i].x > width) {
      peas.splice(i, 1);
    }
  }
}

class Pea {
  constructor(x, y, color, size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.speed = 5;
  }
  
  update() {
    this.x += this.speed;
  }
  
  draw() {
    fill(this.color[0], this.color[1], this.color[2]);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
} 