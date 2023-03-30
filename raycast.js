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
  player_1.show();

}

class Player {
  constructor() {
    this.b = [6,4]
    this.x = 325;
    this.y = 225;
    this.s = 3
    this.a = 0;
  }

  show() {
    // Show player dot
    stroke(0);
    strokeWeight(5);
    point(this.x, this.y);

    // Show player angle
    let dx = cos(this.a)*10
    let dy = sin(this.a)*10
    strokeWeight(1);
    line(this.x,this.y,this.x+dx,this.y+dy)
  }

  blockCheck(input_x, input_y) {
    // Check which block the co-ordinates are in
    let x_block = floor(input_x/50)
    let y_block = floor(input_y/50)
    return [x_block, y_block]
  }

  move() {
    // Store current position of player
    let reset_x = this.x
    let reset_y = this.y

    // Rotation
    if (keyIsDown(188)) {
      this.a -= this.s;
    }
    if (keyIsDown(190)) {
      this.a += this.s;
    }

    if (this.a > 360) {
      this.a = 0
    }
    if (this.a < 0) {
      this.a = 359
    }

    // Translation
    if (keyIsDown(LEFT_ARROW)) {
      this.x += this.s * cos(this.a-90);
      this.y += this.s * sin(this.a-90)
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.s * cos(this.a+90);
      this.y += this.s * sin(this.a+90)
    }
    if (keyIsDown(UP_ARROW)) {
      this.x += this.s * cos(this.a);
      this.y += this.s * sin(this.a);
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.x -= this.s * cos(this.a)
      this.y -= this.s * sin(this.a);
    }

    if (keyIsDown(ENTER)) {
      this.castRay()
    }

    // Check which block player is in
    let player_block = this.blockCheck(this.x, this.y)

    // Reset position if player would move into terrain
    if (grid[player_block[1]][player_block[0]] == 1) {
      this.x = reset_x;
      this.y = reset_y;
    }
    // Only update this.b if it has changed and is valid
    if (this.b[0] != player_block[0] || this.b[1] != player_block[1]) {
      this.b[0] = player_block[0]
      this.b[1] = player_block[0]
    }
  }

  castRay() {
    let dx;
    let dy;
    let da;
    let intr_hx;
    let intr_hy;
    let ray_dir;

    // Horizontal Lines (first contact)
    if (180 <= this.a && this.a <= 359) {
      // Facing up
      ray_dir = "up";
      da = 270 - this.a;
      dy = this.y - floor(this.y/50)*50;
      dx = dy * tan(da);
      intr_hx = this.x-dx;
      intr_hy = this.y-dy;
      intr_hy -= 1;
    } else {
      // Facing down
      ray_dir = "down";
      da = 90 - this.a;
      dy = ceil(this.y/50)*50 - this.y;
      dx = dy * tan(da);
      intr_hx = this.x+dx;
      intr_hy = this.y+dy;
      intr_hy += 1;
    }

    let hor_hit_b;
    let hor_off_x = 50 * tan(da);
    let hor_hypot = 50 / cos(abs(da));
    let hor_count = 0;
    let hor_rayxy;
    let hor_rayln;

    if (0 > intr_hx || intr_hx > 600 || 0 > intr_hy || intr_hy > 400) {
      // Map limits
      hor_hit_b = 1
    } else {
      hor_hit_b = this.blockCheck(intr_hx, intr_hy);
      hor_hit_b = grid[hor_hit_b[1]][hor_hit_b[0]];
    }

    // Keep adding the offset until we hit terrain/limit
    while (hor_hit_b !== 1) {
      
      hor_count++;
      intr_hx = (ray_dir == "up") ? intr_hx - hor_off_x : intr_hx + hor_off_x;
      intr_hy = (ray_dir == "up") ? intr_hy - 50 : intr_hy + 50;

      if (0 > intr_hx || intr_hx > 600 || 0 > intr_hy || intr_hy > 400) {
        // Map limits
        break;
      }

      hor_hit_b = this.blockCheck(intr_hx, intr_hy);
      hor_hit_b = grid[hor_hit_b[1]][hor_hit_b[0]];
    }

    hor_rayxy = [intr_hx,intr_hy];
    hor_rayln = (abs(dx) / sin(abs(da))) + (hor_count * hor_hypot);

    let intr_vx;
    let intr_vy;

    // Vertical Lines (first contact)
    if (90 <= this.a && this.a <= 269) {
      // Facing left
      ray_dir = "left"
      da = 180 - this.a;
      dx = this.x - floor(this.x/50)*50;
      dy = dx * tan(da);
      intr_vx = this.x-dx;
      intr_vy = this.y+dy;
      intr_vx -= 1;
    } else {
      // Facing right
      ray_dir = "right"
      da = ((this.a >= 270) ? 360-this.a : 0-this.a)
      dx = ceil(this.x/50)*50 - this.x;
      dy = dx * tan(da);
      intr_vx = this.x+dx;
      intr_vy = this.y-dy;
      intr_vx += 1;
    }

    let ver_hit_b;
    let ver_off_y = 50 * tan(da);
    let ver_hypot = 50 / cos(abs(da));
    let ver_count = 0;
    let ver_rayxy;
    let ver_rayln;

    if (0 > intr_vx || intr_vx > 600 || 0 > intr_vy || intr_vy > 400) {
      // Map limits
      ver_hit_b = 1
    } else {
      ver_hit_b = this.blockCheck(intr_vx, intr_vy);
      ver_hit_b = grid[ver_hit_b[1]][ver_hit_b[0]];
    }
    
    // Keep adding the offset until we hit terrain/limit
    while (ver_hit_b !== 1) {
      ver_count++;
      intr_vy = (ray_dir == "left") ? intr_vy + ver_off_y : intr_vy - ver_off_y;
      intr_vx = (ray_dir == "left") ? intr_vx - 50 : intr_vx + 50;

      if (0 > intr_vx || intr_vx > 600 || 0 > intr_vy || intr_vy > 400) {
        // Map limits
        break;
      }

      ver_hit_b = this.blockCheck(intr_vx, intr_vy);
      ver_hit_b = grid[ver_hit_b[1]][ver_hit_b[0]];
    }
    ver_rayxy = [intr_vx,intr_vy];
    ver_rayln = (abs(dx) / cos(abs(da))) + (ver_count * ver_hypot);

    if (ver_rayln <= hor_rayln) {
      strokeWeight(1);
      line(this.x,this.y,ver_rayxy[0],ver_rayxy[1]);
    } else {
      strokeWeight(1);
      line(this.x,this.y,hor_rayxy[0],hor_rayxy[1]);
    }
  }
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