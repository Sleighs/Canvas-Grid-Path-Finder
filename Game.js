function Game(grid, gridSize, wallCount){
    //make grid function that returns a 
    this.grid = grid;
    this.gridSize = gridSize;
    this.wallCOunt = wallCount;
    
    this.walls = [];
    this.shortestPath = null;

    for (var i = 0; i < this.gridSize; i++) {
        this.grid[i] = [];
        for (var j = 0; j < this.gridSize; j++) {
            this.grid[i][j] = "Empty";
        }
    }

    this.grid[0][0] = "Start";
    this.grid[7][7] = "Goal";
    this.start = [0,0];
    this.end = [7,7];

    console.log(this.findShortestPath([0,0], this.grid), 'new grid');
    
    //var path = this.findShortestPath([0,0], this.grid);
    //console.log('path', path);
};


// Start location will be in the following format:
// [distanceFromTop, distanceFromLeft]
Game.prototype.findShortestPath = function (startCoordinates, grid) {
  var distanceFromTop = startCoordinates[0];
  var distanceFromLeft = startCoordinates[1];

  // Each "location" will store its coordinates and the shortest path required to arrive there
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
    var newLocation = this.exploreInDirection(currentLocation, "North", grid);
    if (newLocation.status === "Goal") {
      this.shortestPath = newLocation.pathCoordinates;
      return newLocation;
    } else if (newLocation.status === "Valid") {
      queue.push(newLocation);
    }

    // Explore East
    var newLocation = this.exploreInDirection(currentLocation, "East", grid);
    if (newLocation.status === "Goal") {
      this.shortestPath = newLocation.pathCoordinates;
      return newLocation;
    } else if (newLocation.status === "Valid") {
      queue.push(newLocation);
    }

    // Explore South
    var newLocation = this.exploreInDirection(currentLocation, "South", grid);
    if (newLocation.status === "Goal") {
      this.shortestPath = newLocation.pathCoordinates;
      return newLocation;
    } else if (newLocation.status === "Valid") {
      queue.push(newLocation);
    }

    // Explore West
    var newLocation = this.exploreInDirection(currentLocation, "West", grid);
    if (newLocation.status === "Goal") {
      this.shortestPath = newLocation.pathCoordinates;
      return newLocation;
    } else if (newLocation.status === "Valid") {
      queue.push(newLocation);
    }
  }

  // No valid path found
  return false;
};

// This function will check a location's status
Game.prototype.locationStatus = function (location, grid) {
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
Game.prototype.exploreInDirection = function (currentLocation, direction, grid) {
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
  newLocation.status = this.locationStatus(newLocation, grid);
  
  // If this new location is valid, mark it as 'Visited'
  if (newLocation.status === "Valid") {
    grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = "Visited";
  }

  return newLocation;
};
