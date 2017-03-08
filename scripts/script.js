function heuristic(a, b) {
//  return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
  return Math.sqrt(Math.abs(a.i - b.i)**2 + Math.abs(a.j - b.j)**2);
}

var WIDTH = 600;
var HEIGHT = 600;

var cols = 50;
var rows = 50;

var grid = new Array(cols);



var openSet = [];
var closedSet = [];
var path = [];

var start;
var end;

var w, h;

var no_solution = false;
var end_found = false;

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;
  
  if (Math.random() < 0.2) {
    this.wall = true;
  }
  
  this.show = function(color) {
    fill(color);
    
    if (this.wall) {
      fill(0);
    }
    noStroke();
    rect(this.i*w, this.j*h, w-1, h-1)
  }
  
  this.addNeighbors = function(grid) {
      
    if (i < cols-1) {
      this.neighbors.push(grid[i+1][j]);
    }

    if (i > 0) {
      this.neighbors.push(grid[i-1][j]);
    }

    if (j < rows-1) {
      this.neighbors.push(grid[i][j+1]);
    }

    if (j > 0) {
      this.neighbors.push(grid[i][j-1]);
    }
    
    // Diagonals
    if ((i < cols-1) && (j < rows-1)) {
      this.neighbors.push(grid[i+1][j+1]);
    }
    
    if ((i > 0) && (j > 0)) {
      this.neighbors.push(grid[i-1][j-1]);
    }
    
    if ((i < cols-1) && (j > 0)) {
      this.neighbors.push(grid[i+1][j-1]);
    }
    
    if ((i > 0) && (j < rows-1)) {
      this.neighbors.push(grid[i-1][j+1]);
    }
    
  }
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  console.log("A*");
  
  w = width / cols;
  h = height / rows;
  
  for (var i=0; i < cols; i++) {
    grid[i] = new Array(rows);
  }
  
  for (var i=0; i < cols; i++) {
    for (var j=0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }
  
  // Define neighbors
  for (var i=0; i < cols; i++) {
    for (var j=0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }
  
  
  console.log(grid);
  
  start = grid[0][0];
  end = grid[cols-1][rows-1];
  
  
  start.wall = false;
  end.wall = false;
  
  openSet.push(start);
}


function removeFromArray(set, spot) {
  for (var i=set.length-1; i >= 0; i--) {
    if (set[i] === spot) {
      set.splice(i, 1);
    }
  }
}


var loop_counter = 0;
function draw() {
  
  if (loop_counter % 1 == 0) {
    
    search();
  }
  
  
  loop_counter++;
}



function search() {
  var current;
  var neighbors, neighbor;
  var tempG;
  var winner_index;
  
  if (openSet.length > 0) {
    // Select top node in open set
    
    winner_index = 0;
    for (var i=0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[0].f) {
        winner_index = i;
      }
    }
    
    current = openSet[winner_index];
    
    // Check if the current node is the goal. If so, end.
    if (current === end){
      console.log("DONE!");
      end_found = true;
    }
    
    // Remove current spot from the openset and push to closed Set
    removeFromArray(openSet, current);
    closedSet.push(current);
    
    
    // Initialize urrent neighbors
    neighbors = current.neighbors;
    
    // Iterate through neighbors
    for (var i=0; i < neighbors.length; i++) {
      
      // Set current neighbor
      neighbor = neighbors[i];
      
      // If current neighbor is in closed set or a wall, skip to next neighbor
      if (closedSet.includes(neighbor) || neighbor.wall) {
        continue;
      }
      
      // Set temp G
      tempG = current.g + 1;
      
      // Check if neighbor is in open set; if not, push it
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      }
      // Else, already in open set. Check if current g is smaller.
      else if (tempG >= neighbor.g) {
        continue;
      }
      
      // Set current neighbor's previous node
      neighbor.previous = current;
      
      // Update g, h, and f
      neighbor.g = tempG;
      neighbor.h = heuristic(end, neighbor);
      neighbor.f = neighbor.g + neighbor.h;
    }  
    
    
  }
  else {
    // no solution
    console.log("No solution.");no_solution
    no_solution = true;
  }
  
  background(0);
  
  
  // Set grid blocks to white as default
  for (var i=0; i < cols; i++) {
    for (var j=0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }
  
 
  // Set closed set blocks to red
  for (var i=0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }
  
  // Set open set blocks to green
  for (var i=0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }
  
  // Set the path as blue
  if (!no_solution) {
    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
  }
  
  if (end_found || no_solution) {
    noLoop();
  }
  
  for (var i=0; i < path.length; i++) {
    path[i].show(color(0, 0, 255));
  }
}