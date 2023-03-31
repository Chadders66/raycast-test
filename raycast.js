const winWidth = 600;
const winHeight = 800;

const grid = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

function setup() {
  createCanvas(winWidth, winHeight);
  player_1 = new Player();
  angleMode(DEGREES)
}

function draw() {
  background(220);

  // Line separating top-down and pov
  stroke(0);
  strokeWeight(1);
  line(0,winHeight/2,winWidth,winHeight/2);

  // Initialise grid from Array
  initGrid();

  // Player operations
  player_1.move();
  player_1.castRay();
  player_1.show();

}

function initGrid() {
  // Iterate through all blocks in all rows of grid array
  for (let y = 0; y < grid.length; y++) {
    let row = grid[y];
    for (let x = 0; x < row.length; x++) {

      if (row[x] == 1) {
        // Colour terrain blocks Red
        fill(255, 120, 120);
      } else {
        // Colour level blocks White
        fill(255);
      }
      
      // Co-ordinates of block * 50 = origin point of rect()
      orig_x = x * 50;
      orig_y = y * 50;

      // Draw blocks
      stroke(0);
      strokeWeight(0.5);
      rect(orig_x, orig_y, 50, 50);
    }
  }
}