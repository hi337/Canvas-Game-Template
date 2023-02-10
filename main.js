var mainCharacter;
var myObstacle;

function startGame() {
  myGameArea.start();
  mainCharacter = new component(30, 30, "green", 10, 120);
  myObstacle = new component(10, 200, "red", 300, 120);
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 700;
    this.canvas.style.border = "solid 2px";
    this.canvas.height = 393;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[8]);
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener("keydown", function (e) {
      myGameArea.keys = myGameArea.keys || [];
      myGameArea.keys[e.keyCode] = true;
    });
    window.addEventListener("keyup", function (e) {
      myGameArea.keys[e.keyCode] = false;
    });
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  },
};

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  this.newPos = function () {
    this.x += this.speedX;
    this.y += this.speedY;
  };
  this.crashWith = function (otherobj) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;
    var otherleft = otherobj.x;
    var otherright = otherobj.x + otherobj.width;
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + otherobj.height;
    var crash = true;
    if (
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
    ) {
      crash = false;
    }
    return crash;
  };
}

function moveup() {
  mainCharacter.speedY -= 1;
}

function movedown() {
  mainCharacter.speedY += 1;
}

function moveleft() {
  mainCharacter.speedX -= 1;
}

function moveright() {
  mainCharacter.speedX += 1;
}

function stopMove() {
  mainCharacter.speedX = 0;
  mainCharacter.speedY = 0;
}

function stopMove() {
  mainCharacter.speedX = 0;
  mainCharacter.speedY = 0;
}

function updateGameArea() {
  if (mainCharacter.crashWith(myObstacle)) {
    myGameArea.stop();
  } else {
    myGameArea.clear();
    myObstacle.update();
    mainCharacter.speedX = 0;
    mainCharacter.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {
      mainCharacter.speedX = -5;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
      mainCharacter.speedX = 5;
    }
    if (myGameArea.keys && myGameArea.keys[38]) {
      mainCharacter.speedY = -5;
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
      mainCharacter.speedY = 5;
    }
    mainCharacter.newPos();
    mainCharacter.update();
  }
}
