
var Game = {
  grid: [],
  gridSize: 8,
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

// Explores the grid from the given location in the given direction
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

function init(){
  Game.grid = [];
  Game.gridSize = 8;
  Game.shortestPath = null;

  for (var i = 0; i < Game.gridSize; i++) {
    Game.grid[i] = [];
    for (var j = 0; j < Game.gridSize; j++) {
      Game.grid[i][j] = "Empty";
    }
  }
  Game.grid[0][0] = "Start";
  Game.grid[7][7] = "Goal";

  getWalls(Game.startingWallCount);
  console.log(findShortestPath([0, 0], Game.grid));

  
  //DrawWalls(Game.grid);
  //DrawPath(Game.shortestPath);


  new GameManager(Game.grid, Game.gridSize, Game.startingWallCount);
}

// Create a 4x4 grid
// Represent the grid as a 2-dimensional array
/*var gridSize = 8;
var grid = [];

for (var i = 0; i < gridSize; i++) {
  grid[i] = [];
  for (var j = 0; j < gridSize; j++) {
    grid[i][j] = "Empty";
  }
}
grid[0][0] = "Start";
grid[7][7] = "Goal";
*/


function getWalls(num){
  function getRand() {
    return Math.floor(Math.random() * Math.floor(Game.gridSize));
  }

  for (var i = num; i > 0; i--){
    //get random x and y
    var randomX = getRand(Game.gridSize);
    var randomY = getRand(Game.gridSize);

    //check to see if wall exists
    //check to see if path is blocked
    if (Game.grid[randomX][randomY] === "Start" || Game.grid[randomX][randomY] === "Goal"){
      
    } else {
      Game.grid[randomX][randomY] = "Obstacle";
    }
  }

  //if wall already exists create new
}


/*grid[0][5] = "Obstacle";
grid[1][1] = "Obstacle";
grid[1][2] = "Obstacle";
grid[1][3] = "Obstacle";
grid[2][1] = "Obstacle";
grid[3][4] = "Obstacle";
grid[3][7] = "Obstacle";
grid[5][4] = "Obstacle";
grid[7][4] = "Obstacle";*/

//console.log(findShortestPath([0, 0], Game.grid));
console.log(Game.shortestPath);



// Canvas
var cellGrid = {x: Game.gridSize, y: Game.gridSize};
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// Draw Walls
function DrawWalls(grid){
  for (var i = 0; i < Game.gridSize; i++){
    for (var j = 0; j < Game.gridSize; j++){
      if (Game.grid[i][j] === "Obstacle"){
        console.log(i,j, 'wall detected');

        // Fill in obstacles
        var wall = canvas.getContext("2d");
        var wx = (Math.floor((canvas.width - 2)/ cellGrid.x) * i) + i * .5;
        var wy = (Math.floor((canvas.height - 2)/ cellGrid.y) * j) + j * .5;
        wall.fillStyle = "#FF0000";
        wall.fillRect(wx,wy,(canvas.width - 2)/cellGrid.x,(canvas.height - 2)/cellGrid.y);
        wall.stroke();

      }

      if (Game.grid[i][j] === "Goal") {
        console.log(i,j, 'goal reached');

        // Fill in path
        var goal = canvas.getContext("2d");
        var gx = (Math.floor((canvas.width - 2)/ cellGrid.x) * i) + (i * .5);
        var gy = (Math.floor((canvas.height - 2)/ cellGrid.y) * j) + (j * .5);
        goal.fillStyle = "#FFFF00";
        goal.fillRect(gx,gy,(canvas.width - 2)/cellGrid.x,(canvas.height - 2)/cellGrid.y);
        goal.stroke();
      }
    }
  }
}

// Draw shortest path
function DrawPath(coordinates){
  if (coordinates === null){
    console.log('no path available')
    return;
  }

  coordinates.forEach((ele)=>{
      var x = ele[0];
      var y = ele[1];

      // Fill in path
      var path = canvas.getContext("2d");
      var px = (Math.floor((canvas.width) / cellGrid.x) * x) + (x * .5);
      var py = (Math.floor((canvas.height)/ cellGrid.y) * y) + (y * .5);
      path.fillStyle = "#00FF00";
      path.fillRect(px,py,(canvas.width - 2)/cellGrid.x,(canvas.height - 2)/cellGrid.y);
      path.stroke();

      console.log(ele[0], ele[1]);
    });
}

// Draw board
function DrawBoard() {
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


function clearGrid(){
  grid = [];
  for (var i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (var j = 0; j < gridSize; j++) {
      grid[i][j] = "Empty";
    }
  }

  DrawWalls(grid)

}

function actuate(type){  
  // Clear grid
  if (type === 'clear grid'){
    console.log('grid cleared');
    clearGrid();
    DrawWalls(Game.grid);
    return;
  } else {
    clearGrid();
  }

  grid[0][0] = "Start";
  grid[7][7] = "Goal";

  // Get new walls
  if (type === 'new walls'){
    console.log('new walls selected');
    Game.grid = [];
    for (var i = 0; i < gridSize; i++) {
      Game.grid[i] = [];
      for (var j = 0; j < gridSize; j++) {
        Game.grid[i][j] = "Empty";
      }
    }
    
    getWalls(Game.startingWallCount);
    
  }
  DrawWalls(Game.grid);

  //Draw new path
  Game.shortestPath = null;
  console.log(findShortestPath([0, 0], Game.grid));
  DrawPath(Game.shortestPath);
}

//init();

DrawWalls(Game.grid);
DrawPath(Game.shortestPath);
DrawBoard();