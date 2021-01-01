var GameManager = {
    grid: [],
    gridSize: 10,
    gridWidth: null,
    gridHeight: null,
    walls: [],
    shortestPath: [],
    setup: function(grid, gridSize, walls){
        //make walls 
        //make grid
        //set path end points
        //draw board
        //draw walls
        //get shortest path between points
    },
    init: function(){
        var newGrid = [];
        for (var i = 0; i < this.gridSize; i++) {
            newGrid[i] = [];
            for (var j = 0; j < this.gridSize; j++) {
              newGrid[i][j] = "Empty";
            }
        }

        newGrid[0][0] = "Start";
        newGrid[7][7] = "Goal";

        GameManager.grid = newGrid;
    
        Board.getWalls(10);

        var path = Path.findShortestPath([0, 0], GameManager.grid);
        this.path = path;
        
        Board.drawBoard(GameManager.grid);
        Board.drawWalls(GameManager.grid);
        Board.drawPath(this.shortestPath);
    }
};

var Path = {
    findShortestPath: function (startCoordinates, grid) {
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
          var newLocation = this.exploreInDirection(currentLocation, "North", grid);
          if (newLocation.status === "Goal") {
            GameManager.shortestPath = newLocation.pathCoordinates;
            return newLocation;
          } else if (newLocation.status === "Valid") {
            queue.push(newLocation);
          }
      
          // Explore East
          var newLocation = this.exploreInDirection(currentLocation, "East", grid);
          if (newLocation.status === "Goal") {
            GameManager.shortestPath = newLocation.pathCoordinates;
            return newLocation;
          } else if (newLocation.status === "Valid") {
            queue.push(newLocation);
          }
      
          // Explore South
          var newLocation = this.exploreInDirection(currentLocation, "South", grid);
          if (newLocation.status === "Goal") {
            GameManager.shortestPath = newLocation.pathCoordinates;
            return newLocation;
          } else if (newLocation.status === "Valid") {
            queue.push(newLocation);
          }
      
          // Explore West
          var newLocation = this.exploreInDirection(currentLocation, "West", grid);
          if (newLocation.status === "Goal") {
            GameManager.shortestPath = newLocation.pathCoordinates;
            return newLocation;
          } else if (newLocation.status === "Valid") {
            queue.push(newLocation);
          }
        }
      
        // No valid path found
        return false;
      },
      locationStatus: function (location, grid) {
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
      },
      exploreInDirection: function (currentLocation, direction, grid) {
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
          GameManager.grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = "Visited";
        }
      
        return newLocation;
      }
    };

var Board = {
    canvas: document.getElementById('canvas'),
    context: canvas.getContext('2d'),
    cellGrid: {x: GameManager.gridSize, y: GameManager.gridSize},
    getWalls: function(num){
        var newGrid = GameManager.grid;
        function getRand() {
          return Math.floor(Math.random() * Math.floor(GameManager.gridSize));
        }
      
        for (var i = num; i > 0; i--){
          //get random x and y
          var randomX = getRand(GameManager.gridSize);
          var randomY = getRand(GameManager.gridSize);
      
          //check to see if wall exists
          //check to see if path is blocked
          if (newGrid[randomX][randomY] === "Start" || newGrid[randomX][randomY] === "Goal"){
            
          } else {
            newGrid[randomX][randomY] = "Obstacle";
          }
        }

        GameManager.grid = newGrid;


        var path = Path.findShortestPath([0, 0], GameManager.grid);
        this.shortestPath = path;
        


        //console.log(GameManager.grid);
      
        //if wall already exists create new
    },
    drawWalls: function(grid){
        for (var i = 0; i < GameManager.gridSize; i++){
          for (var j = 0; j < GameManager.gridSize; j++){
            if (grid[i][j] === "Obstacle"){
              //console.log(i,j, 'wall detected');
      
              // Fill in obstacles
              var wall = canvas.getContext("2d");
              var wx = (Math.floor((canvas.width - 2)/ this.cellGrid.x) * i) + i * .5;
              var wy = (Math.floor((canvas.height - 2)/ this.cellGrid.y) * j) + j * .5;
              wall.fillStyle = "#FF0000";
              wall.fillRect(wx, wy, (canvas.width - 2)/this.cellGrid.x,(canvas.height - 2)/this.cellGrid.y);
              wall.stroke();
      
            }

            if (grid[i][j] === "Empty"){
                //console.log(i,j, 'wall detected');
        
                // Fill in obstacles
                var wall = canvas.getContext("2d");
                var wx = (Math.floor((canvas.width - 2)/ this.cellGrid.x) * i) + i * .5;
                var wy = (Math.floor((canvas.height - 2)/ this.cellGrid.y) * j) + j * .5;
                wall.fillStyle = "#607D8B";
                wall.fillRect(wx, wy, (canvas.width - 2)/this.cellGrid.x,(canvas.height - 2)/this.cellGrid.y);
                wall.stroke();
        
              }
      
            if (grid[i][j] === "Goal") {
              //console.log(i,j, 'goal reached');
      
              // Fill in path
              var goal = canvas.getContext("2d");
              var gx = (Math.floor((canvas.width - 2)/ this.cellGrid.x) * i) + (i * .5);
              var gy = (Math.floor((canvas.height - 2)/ this.cellGrid.y) * j) + (j * .5);
              goal.fillStyle = "#FFFF00";
              goal.fillRect(gx,gy,(canvas.width - 2)/ this.cellGrid.x,(canvas.height - 2)/this.cellGrid.y);
              goal.stroke();
            }
          }
        }
      },
      drawPath: function(coordinates){
        if (coordinates === null){
          console.log('no path available');
          return;
        }
      
        coordinates.forEach((ele)=>{
            var x = ele[0];
            var y = ele[1];
      
            // Fill in path
            var path = canvas.getContext("2d");
            var px = (Math.floor((canvas.width) / this.cellGrid.x) * x) + (x * .5);
            var py = (Math.floor((canvas.height)/ this.cellGrid.y) * y) + (y * .5);
            path.fillStyle = "#00FF00";
            path.fillRect(px,py,(canvas.width - 2)/this.cellGrid.x,(canvas.height - 2)/this.cellGrid.y);
            path.stroke();
      
            console.log(ele[0], ele[1]);
          });
      },
      drawBoard: function() {
        console.log('canvas h x w', this.canvas.height, this.canvas.width);
        var context = Board.canvas.getContext('2d');
        var w = Board.canvas.width - 2;
        for (var x = 1; x < Board.canvas.width; x += w/this.cellGrid.x) {
          context.moveTo(x, 0);
          context.lineTo(x, 400);
        }
        
        var h = Board.canvas.height - 2;
        for (var y = 1; y < Board.canvas.height; y += h/this.cellGrid.y) {
          context.moveTo(0, y);
          context.lineTo(400, y);
        }
      
        context.stroke();
      },
      clearGrid: function(){
        var grid = [];
        for (var i = 0; i < GameManager.gridSize; i++) {
          grid[i] = [];
          for (var j = 0; j < GameManager.gridSize; j++) {
            grid[i][j] = "Empty";
          }
        }

        GameManager.grid = grid;

        Board.drawWalls(grid)
      }

};

GameManager.init();