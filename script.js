

var Game = {
  shortestPath: null,
  startingWallCount: 10
};

// Start location will be in the following format:
// [distanceFromTop, distanceFromLeft]
var findShortestPath = function (startCoordinates, grid) {
  var distanceFromTop = startCoordinates[0];
  var distanceFromLeft = startCoordinates[1];

  // Each "location" will store its coordinates
  // and the shortest path required to arrive there
  var location = {
    distanceFromTop: distanceFromTop,
    distanceFromLeft: distanceFromLeft,
    path: [],
    pathCoordinates: [],
    status: "Start"
  };

  // Initialize the queue with the start location already inside
  var queue = [location];

  // Loop through the grid searching for the goal
  while (queue.length > 0) {
    // Take the first location off the queue
    var currentLocation = queue.shift();

    // Explore North
    var newLocation = exploreInDirection(currentLocation, "North", grid);
    if (newLocation.status === "Goal") {
      Game.shortestPath = newLocation.pathCoordinates;
      return newLocation;
    } else if (newLocation.status === "Valid") {
      queue.push(newLocation);
    }

    // Explore East
    var newLocation = exploreInDirection(currentLocation, "East", grid);
    if (newLocation.status === "Goal") {
      Game.shortestPath = newLocation.pathCoordinates;
      return newLocation;
    } else if (newLocation.status === "Valid") {
      queue.push(newLocation);
    }

    // Explore South
    var newLocation = exploreInDirection(currentLocation, "South", grid);
    if (newLocation.status === "Goal") {
      Game.shortestPath = newLocation.pathCoordinates;
      return newLocation;
    } else if (newLocation.status === "Valid") {
      queue.push(newLocation);
    }

    // Explore West
    var newLocation = exploreInDirection(currentLocation, "West", grid);
    if (newLocation.status === "Goal") {
      Game.shortestPath = newLocation.pathCoordinates;
      return newLocation;
    } else if (newLocation.status === "Valid") {
      queue.push(newLocation);
    }
  }

  // No valid path found
  return false;
};

// This function will check a location's status
// (a location is "valid" if it is on the grid, is not an "obstacle",
// and has not yet been visited by our algorithm)
// Returns "Valid", "Invalid", "Blocked", or "Goal"
var locationStatus = function (location, grid) {
  var gridSize = grid.length;
  var dft = location.distanceFromTop;
  var dfl = location.distanceFromLeft;

  if (
    location.distanceFromLeft < 0 ||
    location.distanceFromLeft >= gridSize ||
    location.distanceFromTop < 0 ||
    location.distanceFromTop >= gridSize
  ) {
    // location is not on the grid--return false
    return "Invalid";
  } else if (grid[dft][dfl] === "Goal") {
    return "Goal";
  } else if (grid[dft][dfl] !== "Empty") {
    // location is either an obstacle or has been visited
    return "Blocked";
  } else {
    return "Valid";
  }
};

// Explores the grid from the given location in the given
// direction
var exploreInDirection = function (currentLocation, direction, grid) {
  var newPath = currentLocation.path.slice();
  newPath.push(direction);

  var dft = currentLocation.distanceFromTop;
  var dfl = currentLocation.distanceFromLeft;

  var newCoordinates = currentLocation.pathCoordinates.slice();
  newCoordinates.push([dft,dfl]);

  if (direction === "North") {
    dft -= 1;
  } else if (direction === "East") {
    dfl += 1;
  } else if (direction === "South") {
    dft += 1;
  } else if (direction === "West") {
    dfl -= 1;
  }

  var newLocation = {
    distanceFromTop: dft,
    distanceFromLeft: dfl,
    path: newPath,
    pathCoordinates: newCoordinates,
    status: "Unknown"
  };
  newLocation.status = locationStatus(newLocation, grid);
  
  // If this new location is valid, mark it as 'Visited'
  if (newLocation.status === "Valid") {
    grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = "Visited";
  }

  return newLocation;
};

// Create a 4x4 grid
// Represent the grid as a 2-dimensional array
var gridSize = 8;
var grid = [];
for (var i = 0; i < gridSize; i++) {
  grid[i] = [];
  for (var j = 0; j < gridSize; j++) {
    grid[i][j] = "Empty";
  }
}

grid[0][0] = "Start";
grid[7][7] = "Goal";

function getWalls(num){
  var cells = [];
  function getRand(size) {
    return Math.floor(Math.random() * Math.floor(gridSize));
  }

  for (var i = 10; i > 0; i--){
    var randomX = getRand(gridSize);
    var randomY = getRand(gridSize);

    //check to see if wall exists
    //check to see if path is blocked
    if (grid[randomX][randomY] === "Start" || grid[randomX][randomY] === "Goal"){
      
    } else {
      grid[randomX][randomY] = "Obstacle";
    }

  }
  //get random x and y
  //wall already exists create new
}

getWalls(Game.startingWallCount)
/*grid[0][5] = "Obstacle";
grid[1][1] = "Obstacle";
grid[1][2] = "Obstacle";
grid[1][3] = "Obstacle";
grid[2][1] = "Obstacle";
grid[3][4] = "Obstacle";
grid[3][7] = "Obstacle";
grid[5][4] = "Obstacle";
grid[7][4] = "Obstacle";*/

console.log(findShortestPath([0, 0], grid));
console.log(Game.shortestPath);

// Canvas
var cellGrid = {x: gridSize, y: gridSize}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var walls = [];

function DrawWalls(grid){
  for (var i = 0; i < gridSize; i++){
    for (var j = 0; j < gridSize; j++){
      if (grid[i][j] === "Obstacle"){
        console.log(i,j, 'wall detected');

        // Fill in obstacles
        var wall = canvas.getContext("2d");
        var wx = (Math.floor((canvas.width - 2)/ cellGrid.x) * i) + i;
        var wy = (Math.floor((canvas.height - 2)/ cellGrid.y) * j) + j;
        wall.fillStyle = "#FF0000";
        wall.fillRect(wx,wy,(canvas.width - 2)/cellGrid.x,(canvas.height - 2)/cellGrid.y);
        wall.stroke();

      }

      if (grid[i][j] === "Goal") {
        console.log(i,j, 'goal reached');

        // Fill in path
        var goal = canvas.getContext("2d");
        var gx = (Math.floor((canvas.width - 2)/ cellGrid.x) * i) + i;
        var gy = (Math.floor((canvas.height - 2)/ cellGrid.y) * j) + j;
        goal.fillStyle = "#FFFF00";
        goal.fillRect(gx,gy,(canvas.width - 2)/cellGrid.x,(canvas.height - 2)/cellGrid.y);
        goal.stroke();
      }
    }
  }
}

function DrawPath(coordinates){
  if (coordinates === null){
    console.log('no path available')
    return;
  }

  coordinates.forEach((ele)=>{
      console.log(ele[0], ele[1]);

      var x = ele[0];
      var y = ele[1];

      // Fill in path
      var path = canvas.getContext("2d");
      var px = (Math.floor((canvas.width - 2) / cellGrid.x) * x) + x;
      var py = (Math.floor((canvas.height - 2)/ cellGrid.y) * y) + y;
      path.fillStyle = "#00FF00";
      path.fillRect(px,py,(canvas.width - 2)/cellGrid.x,(canvas.height - 2)/cellGrid.y);
      path.stroke();
    });
}

DrawWalls(grid);
DrawPath(Game.shortestPath);

// Draw board

function drawBoard() {
  w = canvas.width - 2;
  for (var x = 1; x < canvas.width; x += w/cellGrid.x) {
    context.moveTo(x, 0);
    context.lineTo(x, 400);
  }
  
  h = canvas.height - 2;
  for (var y = 1; y < canvas.height; y += h/cellGrid.y) {
    context.moveTo(0, y);
    context.lineTo(400, y);
  }

  context.stroke();
}


drawBoard();

function actuate(type){  
  // Clear grid
  grid = [];
  for (var i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (var j = 0; j < gridSize; j++) {
      if (grid[i][j] !== "Start" || grid[i][j] !== "Goal"){
        grid[i][j] = "Empty";
      }
    }
  }

  if (type === 'new walls'){
    console.log('new walls selected');
    grid = [];
    for (var i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (var j = 0; j < gridSize; j++) {
        grid[i][j] = "Empty";
      }
    }
    
    getWalls(Game.startingWallCount);
    
  }
  
  grid[0][0] = "Start";
  grid[7][7] = "Goal";

  Game.shortestPath = null;

  findShortestPath([0, 0], grid);
  DrawWalls(grid);
  DrawPath(Game.shortestPath);
}