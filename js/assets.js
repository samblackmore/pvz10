// Asset Management
let menuBg;
let avatars = {};
let bgMusic;

const avatarFiles = [
  { name: 'drummer', file: 'drummer.png', display: 'Drummer Zombie', type: 'zombie' },
  { name: 'onion', file: 'onion.png', display: 'Onion Zombie', type: 'zombie' },
  { name: 'blueberries', file: 'blueberries.png', display: 'Blueberries Zombie', type: 'zombie' },
  { name: 'nurse', file: 'nurse.png', display: 'Nurse Zombie', type: 'zombie' },
];

function loadAssets() {
  menuBg = loadImage('assets/images/menu/background.png');
  bgMusic = loadSound('assets/music/day.m4a');
  
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