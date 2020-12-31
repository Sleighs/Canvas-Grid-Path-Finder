function GameManager(grid, gridSize, gridWidth, gridHeight){
    this.grid = grid;
    this.gridSize = gridSize;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    this.cellGrid = {x: GameManager.gridSize, y: GameManager.gridSize};
    this.canvas = document.getElementById('canvas');

    this.setup();
  }

GameManager.prototype.setup = function(){
    this.getWalls();
    
    new Game([], 10, 10);

    console.log('game setup running');

    this.drawBoard(this.grid);
    this.drawWalls(this.grid);


    //update actuator
};







GameManager.prototype.getWalls = function(n){
    function getRand() {
        return Math.floor(Math.random() * Math.floor(GameManager.gridSize));
    }

    for (var i = n; i > 0; i--){
    //get random x and y
    var randomX = getRand(GameManager.gridSize);
    var randomY = getRand(GameManager.gridSize);

    //check to see if wall exists
    //check to see if path is blocked
    if (this.grid[randomX][randomY] === "Start" || this.grid[randomX][randomY] === "Goal"){
        
    } else {
        this.grid[randomX][randomY] = "Obstacle";
    }
    }
};



// Canvas
var cellGrid = {x: GameManager.gridSize, y: GameManager.gridSize};
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// Draw Walls
GameManager.prototype.drawWalls = function (grid){
    var cellGrid = {x: GameManager.gridSize, y: GameManager.gridSize};
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

  for (var i = 0; i < GameManager.gridSize; i++){
    for (var j = 0; j < GameManager.gridSize; j++){
      if (grid[i][j] === "Obstacle"){
        console.log(i,j, 'wall detected');

        // Fill in obstacles
        var wall = canvas.getContext("2d");
        var wx = (Math.floor((canvas.width - 2)/ cellGrid.x) * i) + i * .5;
        var wy = (Math.floor((canvas.height - 2)/ cellGrid.y) * j) + j * .5;
        wall.fillStyle = "#FF0000";
        wall.fillRect(wx,wy,(canvas.width - 2)/cellGrid.x,(canvas.height - 2)/cellGrid.y);
        wall.stroke();

      }

      if (grid[i][j] === "Goal") {
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
GameManager.prototype.drawPath = function (coordinates){
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
GameManager.prototype.drawBoard = function() {
  var context = canvas.getContext('2d');
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