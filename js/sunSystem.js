// Sun System
let sunCount = 50; // Starting suns
let suns = [];
let sunDropTimer = 0;
let sunDropInterval = 120; // frames between sun drops (2 seconds at 60fps)
const MAX_SUNS = 20;

const SUN_TYPES = [
  { name: 'small', value: 5, radius: 20, weight: 0.7 },      // 70% chance
  { name: 'big', value: 25, radius: 32, weight: 0.28 },      // 28% chance
  { name: 'enormous', value: 100, radius: 48, weight: 0.02 } // 2% chance
];

function drawSunCounter(margin, panelW) {
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
}

function updateSunDrops(gridX, gridY, gridW, gridH) {
  if (frameCount > 1) {
    sunDropTimer--;
    if (sunDropTimer <= 0 && suns.length < MAX_SUNS) {
      spawnSun(gridX, gridY, gridW, gridH);
      sunDropTimer = sunDropInterval + int(random(-30, 60)); // randomize interval
    }
  }
}

function updateAndDrawSuns() {
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

function checkSunCollection(mouseX, mouseY) {
  for (let i = suns.length - 1; i >= 0; i--) {
    if (suns[i].isUnderMouse(mouseX, mouseY)) {
      sunCount += suns[i].type.value;
      suns[i].collected = true;
      return true;
    }
  }
  return false;
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