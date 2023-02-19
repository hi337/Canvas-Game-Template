//variables
let minuite,
  score = 0;
let top_score = +window.localStorage.getItem("top_score") || 0;
let is_mobile = false;

//check mobile device
if (
  navigator.userAgent.match(/Android/i) ||
  navigator.userAgent.match(/webOS/i) ||
  navigator.userAgent.match(/iPhone/i) ||
  navigator.userAgent.match(/iPad/i) ||
  navigator.userAgent.match(/iPod/i) ||
  navigator.userAgent.match(/BlackBerry/i) ||
  navigator.userAgent.match(/Windows Phone/i)
) {
  is_mobile = true;
}

//initialization of the game area and components
function startGame() {
  myGameArea.start();
  if (!is_mobile) {
    document.getElementById("joyDiv").remove();
  } else {
    let joy = new JoyStick("joyDiv");
  }
  mainCharacter = new component(30, 30, "green", mainCharx, mainChary);
  borderTop = new border_comp(700, 10, "red", 0, 0, "top");
  borderBottom = new border_comp(700, 10, "red", 0, 390, "bottom");
  borderLeft = new border_comp(10, 393, "red", 0, 10, "left");
  borderRight = new border_comp(10, 393, "red", 690, 10, "right");
  myScore = new text_comp("70px", "Consolas", "black", 200, 40);
  topScore = new text_comp("70px", "Consolas", "black", 330, 40);
  Health = new text_comp("70px", "Consolas", "black", 460, 40);
}

//Where the canvas element is initialized and controlled
var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 700;
    this.canvas.height = 400;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[8]);
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener("keydown", function (e) {
      myGameArea.keys = myGameArea.keys || {};
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

//what happens everytime the frame updates
function updateGameArea() {
  if (mainCharacter.crashWith(borderTop)) {
    mainCharacter.y = 360;
  } else if (mainCharacter.crashWith(borderBottom)) {
    mainCharacter.y = 8;
  } else if (mainCharacter.crashWith(borderRight)) {
    mainCharacter.x = 8;
  } else if (mainCharacter.crashWith(borderLeft)) {
    mainCharacter.x = 660;
  }
  myGameArea.clear();
  borderTop.update();
  borderBottom.update();
  borderLeft.update();
  borderRight.update();

  time_before_next_shot++;

  if (time_before_next_shot >= interval) {
    choose_shooting_border();
    if (chosen_border == "top") {
      borderTop.shoot();
    } else if (chosen_border == "bottom") {
      borderBottom.shoot();
    } else if (chosen_border == "left") {
      borderLeft.shoot();
    } else if (chosen_border == "right") {
      borderRight.shoot();
    }
    time_before_next_shot = 0;

    if (interval > 10) {
      interval -= 0.1;
    }
  }

  for (var y = 0; y < bullet_array.length; y++) {
    if (
      bullet_array[y].crashWith(borderBottom) ||
      bullet_array[y].crashWith(borderLeft) ||
      bullet_array[y].crashWith(borderTop) ||
      bullet_array[y].crashWith(borderRight)
    ) {
      delete bullet_array[y];
    } else if (bullet_array[y].crashWith(mainCharacter)) {
      delete bullet_array[y];
      health -= 1;
    }

    bullet_array = bullet_array.filter((item) => item !== undefined);

    bullet_array[y].newPos();
    bullet_array[y].update();
  }

  // processing the one point per second rule
  if (minuite < 50) {
    minuite++;
  } else {
    minuite = 0;
    score++;
  }
  //changing top_score for efficient instant adjustment
  if (score > top_score) {
    top_score++;
  }
  topScore.text = `TOP SCORE: ${top_score}`;
  topScore.update();

  //changing the text for myScore
  myScore.text = `SCORE: ${score}`;
  myScore.update();
  //update health
  if (health <= 0) {
    window.localStorage.setItem("top_score", top_score);
    myGameArea.stop();
  }
  Health.text = `HEALTH: ${health}`;
  Health.update();

  //Moving the character
  mainCharacter.speedX = 0;
  mainCharacter.speedY = 0;

  if (myGameArea.keys && (myGameArea.keys[37] || myGameArea.keys[65])) {
    mainCharacter.speedX = -5;
  }
  if (myGameArea.keys && (myGameArea.keys[39] || myGameArea.keys[68])) {
    mainCharacter.speedX = 5;
  }
  if (myGameArea.keys && (myGameArea.keys[38] || myGameArea.keys[87])) {
    mainCharacter.speedY = -5;
  }
  if (myGameArea.keys && (myGameArea.keys[40] || myGameArea.keys[83])) {
    mainCharacter.speedY = 5;
  }
  mainCharacter.newPos();
  mainCharacter.update();
}
