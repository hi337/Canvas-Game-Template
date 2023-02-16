//components
var mainCharacter;
var borderTop;
var borderBottom;
var borderLeft;
var myScore;
var topScore;
var borderRight;
let bullet_array = [];
let interval = 10000;
let health = 3;

// //mapping of name to component
// let name_border_map = {
//   top: "borderTop",
//   bottom: "borderBottom",
//   left: "borderLeft",
//   right: "borderRight",
// };
//array of border components
let border_arr = ["top", "bottom", "left", "right"];

//function causes one of the borders to shoot a bullet from a random spot on the side facing inwards and at a random degree. They start of slowly shooting, but the interval shrinks to a certain number, until it shoots 4-5 per minuite.
function choose_shooting_border() {
  setTimeout(() => {
    if (interval > 20) {
      interval -= 1;
    }
    let chosen_border =
      border_arr[Math.floor(Math.random() * border_arr.length)];
    return chosen_border;
  }, interval);
}

//bullet component. will have a hit
function bullet_comp(x, y, direction) {
  this.x = x;
  this.y = y;
  this.width = 10;
  this.height = 10;
  this.direction = direction;
  this.color = "red";
  this.update = function () {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  //changes the position of the component
  this.newPos = function () {
    if (this.direction == "down") {
      this.y -= 3;
    } else if (this.direction == "up") {
      this.y += 3;
    } else if (this.direction == "left") {
      this.x -= 3;
    } else if (this.direction == "right") {
      this.x += 3;
    }
  };
  //collision detection
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
    if (crash) {
      if (otherobj.type == "border") {
        return;
      } else if (otherobj.type == "component") {
        health -= 1;
        return;
      }
    }
  };
}

//border component, which will be shooting out the flames
function border_comp(width, height, color, x, y, name) {
  this.type = "border";
  this.name = name;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  this.shoot = function () {
    if (this.name == "top") {
      bullet_array.push(new bullet_comp(getRandomInt(20, 680), 8, "down"));
    } else if (this.name == "bottom") {
      bullet_array.push(new bullet_comp(getRandomInt(20, 680), 360, "up"));
    } else if (this.name == "left") {
      bullet_array.push(new bullet_comp(8, getRandomInt(20, 370), "right"));
    } else if (this.name == "right") {
      bullet_array.push(new bullet_comp(660, getRandomInt(20, 370), "left"));
    }
  };
}

//Text component for the score and initial screen
function text_comp(size, font, color, x, y) {
  this.type = "text";
  this.width = size;
  this.height = font;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx.font = this.size + " " + this.height;
    ctx.fillStyle = color;
    ctx.fillText(this.text, this.x, this.y);
  };
}

//default component for main characters and borders
function component(width, height, color, x, y) {
  this.type = "component";
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
  //changes the position of the component
  this.newPos = function () {
    this.x += this.speedX;
    this.y += this.speedY;
  };
  //collision detection
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

//movements for the mainCharacter
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @todo once bullets implemented, turn them into firseball emoji.
 * @todo for bullet in bullet array, check for collision. If hit border, remove. if hit mainChar, loose a life from the global health var. update and render. If !border, got this.hit = true. From there in the update function, loose one life. Make health a global variable set to 3. When 0, gameArea.stop()
 */
