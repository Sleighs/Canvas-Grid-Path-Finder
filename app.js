var GameManager = {
    grid: [],
    gridSize: 12,
    gridWidth: null,
    gridHeight: null,
    walls: [],
    startingWallCount: 23,
    shortestPath: [],
    startLocation: [1, 1],
    endLocation: [10, 10],
    getStart: function(){
        var start = document.getElementById('start-location-input').value;
        //console.log('get start', start)

        if (GameManager.startLocation === null){
          GameManager.startLocation = [1, 1];
        }
        
        GameManager.grid[this.startLocation[0], this.startLocation[1]] = "Start";
        Board.getEnemyStart();
    },
    getEnd: function(){
        GameManager.grid[this.endLocation[0], this.endLocation[1]] = "Goal";
    },
    init: function(){
        var newGrid = [];
        for (var i = 0; i < this.gridSize; i++) {
            newGrid[i] = [];
            for (var j = 0; j < this.gridSize; j++) {
              newGrid[i][j] = "Empty";
            }
        }

        newGrid[this.startLocation[0]][this.startLocation[1]] = "Start";
        newGrid[this.endLocation[0]][this.endLocation[1]] = "Goal";

        Board.clearGrid();
        GameManager.grid = newGrid;
        Board.getWalls(this.startingWallCount);

        var path = Path.findShortestPath([this.startLocation[0], this.startLocation[1]], GameManager.grid);
        this.path = path;
        
        Board.drawBoard();
        Board.drawPath(GameManager.shortestPath);
        Board.drawWalls(GameManager.grid);

        console.log('GameManager', GameManager);

        Board.canvas.addEventListener('click', (e)=>{handleClick(e)});
    },
    newBoard: function(){
      var newGrid = [];
      for (var i = 0; i < this.gridSize; i++) {
          newGrid[i] = [];
          for (var j = 0; j < this.gridSize; j++) {
            newGrid[i][j] = 'Empty';
          }
      }

      newGrid[this.startLocation[0]][this.startLocation[1]] = 'Start';
      newGrid[this.endLocation[0]][this.endLocation[1]] = 'Goal';
      GameManager.grid = newGrid;

      Board.clearGrid();
      Board.getWalls(23);
      Board.drawWalls(GameManager.grid);
      Board.drawBoard();
      console.log('new board');
    },
    getPath: function(){
        var path = Path.findShortestPath([this.startLocation[0], this.startLocation[1]], GameManager.grid);
        GameManager.path = path;
    },
    updateEndPoints: function(){
        var sx = document.getElementById("start-location-inputx").value;
        var sy = document.getElementById("start-location-inputy").value;
        var gx = document.getElementById("end-location-inputx").value;
        var gy = document.getElementById("end-location-inputy").value;
        var sxMax = document.getElementById("start-location-inputx").maxLength;
        var syMax = document.getElementById("start-location-inputy").maxLength;
        var gxMax = document.getElementById("end-location-inputx").maxLength;
        var gyMax = document.getElementById("end-location-inputy").maxLength;

        sxMax = GameManager.gridSize - 1;
        syMax = GameManager.gridSize - 1;
        gxMax = GameManager.gridSize - 1;
        gyMax = GameManager.gridSize - 1;

        this.startLocation = [sx, sy];
        this.endLocation = [gx, gy];
        
        if (this.startLocation === this.endLocation){
            console.log('endpoints are the same');
            return;
        }

        GameManager.grid[sx, sy] = "Start";
        GameManager.grid[gx, gy] = "Goal";

        /*var sxText = document.getElementById("start-x-text");
        var syText = document.getElementById("start-y-text");
        sxText.innerHTML = this.startLocation[0];
        syText.innerHTML = this.startLocation[1];
        */
        

        console.log('endpoints updated', this.startLocation, this.endLocation)
    },
    actuator: function(){
        
    },
    gameTime: null,
    clockStart: function() {
      /*if (this.state == "started"){
        this.stop();
      } else {
        //if watch hasn't started create new start time
        if (this.timeBegan === null) {
          this.timeBegan = new Date();
          this.timeBeganMaster = this.timeBegan;
        }
        
        //Add stopped duration to account for restarting watch
        if (this.timeStopped !== null) {
            this.stoppedDuration += (new Date() - this.timeStopped);
        }
        
        //Set interval to start wtch
        this.started = setInterval(this.clockRunning, 10);
        this.state = "started";
        document.getElementById("sw-start").innerHTML = "Stop";
        document.getElementById("sw-lap-btn").style.display = "inline-block";
        this.blink("start stopwatch");    
      }*/
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
  
    // Loop through the grid until goal is reached
    while (queue.length > 0) {
      // Take the first location off the queue
      var currentLocation = queue.shift();

      // Set to explore the direction closest to the end location first
    

      // Explore North
      var newLocation = this.exploreInDirection(currentLocation, "North", grid);
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
      
      // Explore South
      var newLocation = this.exploreInDirection(currentLocation, "South", grid);
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
          // Get random x and y
          var randomX = getRand(GameManager.gridSize);
          var randomY = getRand(GameManager.gridSize);
      
          // Check to see if path is blocked
          if (newGrid[randomX][randomY] === "Start" || newGrid[randomX][randomY] === "Goal"){
            
          } else {
            newGrid[randomX][randomY] = "Obstacle";
            GameManager.walls.push([randomX,randomY])
          }
        }

        GameManager.grid = newGrid;
    },
    drawWalls: function(grid){
        var canvas = this.canvas;
        for (var i = 0; i < GameManager.gridSize; i++){
          for (var j = 0; j < GameManager.gridSize; j++){
            if (grid[i][j] === "Obstacle"){
              //console.log(i,j, 'wall detected');
      
              // Fill in obstacles
              var wall = canvas.getContext("2d");
              var wx = (Board.canvas.width/ this.cellGrid.x) * i;
              var wy = (Board.canvas.height/ this.cellGrid.y) * j;
              wall.fillStyle = "#E57373";
              wall.fillRect(wx, wy, (Board.canvas.width - 2)/this.cellGrid.x,(Board.canvas.height - 2)/this.cellGrid.y);
              wall.stroke();
      
            }

            if (grid[i][j] === "Empty"){
                var wall = canvas.getContext("2d");
                var wx = ((canvas.width)/ this.cellGrid.x) * i;
                var wy = ((canvas.height)/ this.cellGrid.y) * j;
                wall.fillStyle = "#607D8B";
                wall.fillRect(wx, wy, (canvas.width - 2)/this.cellGrid.x,(canvas.height - 2)/this.cellGrid.y);
                wall.stroke();
        
              }
              
            if (grid[i][j] === "Start") {
                // Fill in path
                var start = canvas.getContext("2d");
                var sx = (Board.canvas.width / this.cellGrid.x) * i;
                var sy = (Board.canvas.height/ this.cellGrid.y) * j;
                start.fillStyle = "aqua";
                start.fillRect(sx,sy,(canvas.width - 2)/ this.cellGrid.x,(canvas.height - 2)/this.cellGrid.y);
                start.stroke();
              }

            if (grid[i][j] === "Goal") {
              //console.log(i,j, 'goal reached');
      
              // Fill in path
              var goal = canvas.getContext("2d");
              var gx = (Board.canvas.width / this.cellGrid.x) * i;
              var gy = (Board.canvas.height/ this.cellGrid.y) * j;
              goal.fillStyle = "#FFFF00";
              goal.fillRect(gx,gy,(Board.canvas.width - 2)/ this.cellGrid.x,(Board.canvas.height - 2)/this.cellGrid.y);
              goal.stroke();
            }
          }
        }
      },
      drawPath: function(coordinates){
        Board.clearPath();
        GameManager.getPath();

        if (coordinates === null){
          console.log('no path available');
          return;
        }
      
        coordinates.forEach((ele)=>{
            var x = ele[0];
            var y = ele[1];
      
            // Fill in path
            if (GameManager.grid[x][y] !== "Start"){
                var path = canvas.getContext("2d");
                var px = (Board.canvas.width / this.cellGrid.x) * x;
                var py = (Board.canvas.height/ this.cellGrid.y) * y;
                path.fillStyle = "#00E676";
                path.fillRect(px,py,(Board.canvas.width - 2)/this.cellGrid.x,(Board.canvas.height - 2)/this.cellGrid.y);
                path.stroke();

                // Set value to 'Path'
                GameManager.grid[x][y] = "Path"
            }

            // Make path for enemies to follow
          });
      },
      drawBoard: function() {
        //console.log('canvas h x w', this.canvas.height, this.canvas.width);
        var context = Board.canvas.getContext('2d');
        var w = Board.canvas.width - 2;
        for (var x = 1; x < Board.canvas.width; x += w/this.cellGrid.x ) {
          context.moveTo(x, 0);
          context.lineTo(x, 504);
        }
        
        var h = Board.canvas.height - 2;
        for (var y = 1; y < Board.canvas.height; y += h/this.cellGrid.y) {
          context.moveTo(0, y);
          context.lineTo(504, y);
        }
        
        context.lineWidth = 2;
        context.strokeStyle = "white";
        context.stroke();
      },
      clearGrid: function(type){
        var grid;
        if (type === "new path"){
          grid = GameManager.grid;
        } else {
          grid = [];
          for (var i = 0; i < GameManager.gridSize; i++) {
            grid[i] = [];
            for (var j = 0; j < GameManager.gridSize; j++) {
              grid[i][j] = "Empty";
            }
          }

          grid[GameManager.startLocation[0]][GameManager.startLocation[1]] = "Start";
          grid[GameManager.endLocation[0]][GameManager.endLocation[1]] = "Goal";

          GameManager.grid = grid;
        }

        Board.drawWalls(grid);
        Board.drawBoard();
      },
      clearPath: function(){
          var grid = GameManager.grid;
          for (var i = 0; i < GameManager.gridSize; i++) {
            for (var j = 0; j < GameManager.gridSize; j++) {
              if (grid[i][j] === "Path"){
                grid[i][j] = "Empty";
              }
            }
          }

          GameManager.grid = grid;
          Board.drawBoard();
          Board.drawWalls(GameManager.grid);
      },
      enemyX: null,
      enemyY: null,
      getEnemyStart:function(){
          var x = (Board.canvas.width / Board.cellGrid.x) * GameManager.startLocation[0];
          var y = (Board.canvas.height/ Board.cellGrid.y) * GameManager.startLocation[1];
          Board.enemyX = x + ((Board.canvas.width / Board.cellGrid.x)/2);
          Board.enemyY = y + ((Board.canvas.width / Board.cellGrid.y)/2);
      },
      drawEnemy: function (){
        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);

        Board.drawBoard(GameManager.grid);
        Board.drawPath(GameManager.shortestPath);
        Board.drawWalls(GameManager.grid);

        Board.animateEnemy(Board.enemyX, Board.enemyY, context);

        Board.enemyX = Board.enemyX + 1; //Board.canvas.width / Board.cellGrid.x;
        Board.enemyY = Board.enemyY + 1; //Board.canvas.width / Board.cellGrid.y;
      },
      pauseEnemy: function(){
        clearInterval();
      },
      animateEnemy: function (x, y, ctx){
        ctx.beginPath();
        ctx.arc(x , y, 10, 0, Math.PI*3);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
        
        console.log('moved', Board.enemyX, Board.enemyY);
      }
      

};



window.onload = function() {
    GameManager.init();
}

function getMousePos(canvas, event){
    var rect = canvas.getBoundingClientRect();
    return ({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    })
}
function handleClick(){
    var position = getMousePos(Board.canvas, event)
    console.log(position);

    var newGrid = GameManager.grid;

    var clickedCell = {
        x: Math.floor(position.x / (Board.canvas.width / GameManager.gridSize)), 
        y: Math.floor(position.y/ (Board.canvas.height / GameManager.gridSize))
    }

    if (GameManager.clickedCell === null || GameManager.clickedCell !== clickedCell){
        GameManager.clickedCell = clickedCell;
    } 

    switch(GameManager.grid[clickedCell.x][clickedCell.y]){
      case "Empty":
      case "Visited":
      case "Path":
        newGrid[clickedCell.x][clickedCell.y] = "Obstacle";
        break;
      case "Obstacle":
        newGrid[clickedCell.x][clickedCell.y] = "Empty";
        break;
    }

    for (var i = 0; i < GameManager.gridSize; i++){
      for (var j = 0; j < GameManager.gridSize; j++){
        if (newGrid[i][j] === "Path" || newGrid[i][j] === "Visited"){
          newGrid[i][j] = "Empty"
        }
      }
    }

    GameManager.grid = newGrid;
    Board.clearGrid("new path");
    
    GameManager.getPath();

    Board.drawBoard();
    Board.drawPath(GameManager.shortestPath);
    Board.drawWalls(GameManager.grid);

    console.log('clicked cell', GameManager.clickedCell, 'grid:', GameManager.grid[clickedCell.x][clickedCell.y]);
}
