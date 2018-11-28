var windowX = 1200;
var windowY = 900;
var game = new Phaser.Game(windowX, windowY, Phaser.AUTO, 'Circle-Square', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  game.load.image('circle', 'assets/circle3.png');
  game.load.image('square', 'assets/square2.png');
  game.load.image('star', 'assets/demoscene/star2.png');
  game.load.image('baddie', 'assets/sprites/space-baddie.png');
  game.load.audio('pew', ['assets/laser.mp3']);
}

var stars;
var squareSockFire = false;
var circleSockFire = false;
var gameStarted = false;
var circleBullet;
var squareBullet;

function create() {

  game.world.setBounds(0, 0, windowX, windowY);
  game.physics.arcade.enable(this);
  stars = game.add.group();
  // Create the group using the group factory

  lasers = game.add.group();
  lasers.laserType = "circle";
  lasers.enableBody = true;
  lasers.physicsBodyType = Phaser.Physics.ARCADE;
  lasers.createMultiple(1, 'star');
  pew = game.add.audio('pew');

  for (var i = 0; i < 128; i++) {
    stars.create(game.world.randomX, game.world.randomY, 'star');
  }

  lasers.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetLaser);
  lasers.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
  lasers.setAll('checkWorldBounds', true);
  lasers.setAll('scale.x', 10);

  circle = game.add.sprite(100, 100, 'circle');
  circleBullet = game.add.sprite(-500, -500, 'circle');
  circleBullet.enableBody = true;
  circleBullet.physicsBodyType = Phaser.Physics.ARCADE;
  squareBullet = game.add.sprite(-500, -500, 'square');
  squareBullet.enableBody = true;
  squareBullet.physicsBodyType = Phaser.Physics.ARCADE;
  squareBullet.scale.setTo(0.25);

  game.physics.arcade.enable(circleBullet);
  game.physics.arcade.enable(squareBullet);


  square = game.add.sprite(1075, 100, 'square');
  // circleBullet.enableBody = true;
  square.scale.setTo(0.5);
  circle.scale.setTo(0.5);

  circleBullet.anchor.x = 0.5;
  circleBullet.scale.setTo(0.25);
  circleBullet.anchor.y = 0.5;
  circle.proportion = 0.5;
  square.proportion = 0.5;
  circle.anchor.x = 0.5;
  square.anchor.x = 0.5;
  circle.anchor.y = 0.5;
  square.anchor.y = 0.5;
  this.game.physics.arcade.enable(circle);
  this.game.physics.arcade.enable(square);
  circle.enableBody = true;
  square.enableBody = true;
  circle.body.immovable = true;
  square.body.immovable = true;


  circleUp = game.input.keyboard.addKey(Phaser.Keyboard.W);
  circleDown = game.input.keyboard.addKey(Phaser.Keyboard.S);
  circleFire = game.input.keyboard.addKey(Phaser.Keyboard.Q);

  squareUp = game.input.keyboard.addKey(Phaser.Keyboard.O);
  squareDown = game.input.keyboard.addKey(Phaser.Keyboard.L);
  squareFire = game.input.keyboard.addKey(Phaser.Keyboard.P);

  gameStarted = true;
}

function resetLaser(laser) {
  // Destroy the laser
  laser.kill();
}

function fireLaser(object, velocity, objectType) {
  // Get the first laser that's inactive, by passing 'false' as a parameter
  var laser = lasers.getFirstExists(false);
  pew.play();

  lasers.laserType = objectType;
  if (laser) {
    // If we have a laser, set it to the starting position
    laser.reset(object.x, object.y);
    // Give it a velocity of -500 so it starts shooting
    laser.body.velocity.x = -1 * velocity;
  }

}

function collideDetect(object, objectType) {
  console.log(this.lasers.laserType);
  // var laser = lasers.getFirstExists(true);
  // resetLaser(laser);
  object.proportion = object.proportion * 1.25;

  if (object.proportion > 2) {
    object.kill();
    object.proportion = 0.5;
  }
  object.scale.setTo(object.proportion);
}

var inputDelta = 0;
var socData = [0, 0, false, false, .5, .5];

function movePlayer(y) {
  if (gameStarted) {
    if (!(circleUp.isDown || circleDown.isDown)) {
      circle.y = y[1];
    }
    if (!(squareUp.isDown || squareDown.isDown)) {
      square.y = y[0];
    }

    squareSockFire = y[2];

    circleSockFire = y[3];
    // circle.proportion = y[4];
    // square.proportion = y[5];
    if (circleSockFire || squareSockFire) {
      console.log("Square Sock fire: " + squareSockFire);
      console.log("Circle Sock fire: " + circleSockFire);
    }

    if ((squareSockFire)) {
      inputDelta = 0;
      fire(false);
    }
    if ((circleSockFire)) {
      inputDelta = 0;
      fire(true);
    }
    squareSockFire = false;
    circleSockFire = false;
    // if (circle.proportion > 0.5 || square.proportion > 0.5) {
    //   circle.scale.setTo(circle.proportion);
    //   square.scale.setTo(square.proportion);
    // }



  }
}
var serverDelta = 0;

function update() {
  inputDelta++;
  square.angle += 2;
  circle.angle += 2;
  serverDelta++;

  serverDelta = 0;



  if (this.game.physics.arcade.collide(circle, squareBullet, null, null, circle.proportion)) {
    collideDetect(circle, "circle");
    squareBullet.y = -500;
  }
  if (this.game.physics.arcade.collide(square, circleBullet, null, null, square.proportion)) {
    collideDetect(square, "square");
    circleBullet.y = -500;
  }

  // Circle Buttons
  if ((circleFire.isDown) && inputDelta > 60) {
    fire(true);
    circleSockFire = true;

    inputDelta = 0;

    if (lasers.laserType == "square") {
      fireLaser(circle, (-3000), "circle");
    }
  }
  if (circleUp.isDown) {
    if (circle.y >= (circle.height / 2)) {
      circle.y -= 10;
    }
  } else if (circleDown.isDown) {
    if (circle.y <= windowY - (circle.height / 2)) {
      circle.y += 10;
    }
  }

  // Square Buttons
  if ((squareFire.isDown) && inputDelta > 60) {
    fire(false);
    squareSockFire = true;


    inputDelta = 0;
    if (lasers.laserType == "circle") {
      fireLaser(square, 3000, "square");
    }
  }
  if (squareUp.isDown) {
    if (square.y >= (square.height / 2)) {
      square.y -= 10;
    }
  } else if (squareDown.isDown) {
    if (square.y <= windowY - (square.height / 2)) {
      square.y += 10;
    }
  }
  socData = [square.y, circle.y, squareSockFire, circleSockFire];
  Client.socket.emit('cords', socData);
}

function fire(isCircle) {
  if (isCircle) {
    console.log("circle");

    circleBullet.x = circle.x;
    circleBullet.y = circle.y;

    circleBullet.body.velocity.x = 3000;
  } else {
    squareBullet.x = square.x;
    squareBullet.y = square.y;
    squareBullet.body.velocity.x = -3000;

  }
}
