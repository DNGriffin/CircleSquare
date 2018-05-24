var windowX = 1200;
var windowY = 900;
var game = new Phaser.Game(windowX, windowY, Phaser.CANVAS, 'phaser-example', {
  preload: preload,
  create: create,
  update: update
});

function preload() {

  game.load.image('player', 'assets/ship.png');
  game.load.image('circle', 'assets/circle3.png');
  game.load.image('square', 'assets/square2.png');
  game.load.image('star', 'assets/demoscene/star2.png');
  game.load.image('baddie', 'assets/sprites/space-baddie.png');
  game.load.audio('pew', ['assets/laser.mp3']);

}

var stars;
var baddies;
var player;
var cursors;
var fireButton;
var bulletTime = 0;
var frameTime = 0;
var frames;
var prevCamX = 0;

function create() {
  game.world.setBounds(0, 0, windowX, windowY);
  game.physics.arcade.enable(this);
  frames = Phaser.Animation.generateFrameNames('frame', 2, 30, '', 2);
  frames.unshift('frame02');
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
  circle.scale.setTo(0.5);
  square = game.add.sprite(1075, 100, 'square');
  square.scale.setTo(0.5);

  //lives
  //var image = game.add.image(100, 100, 'pic');
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

  player = game.add.sprite(100, 1000, 'player');
  player.anchor.x = 0.5;
  game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1);
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  circleUp = game.input.keyboard.addKey(Phaser.Keyboard.W);
  circleDown = game.input.keyboard.addKey(Phaser.Keyboard.S);
  circleFire = game.input.keyboard.addKey(Phaser.Keyboard.Q);

  squareUp = game.input.keyboard.addKey(Phaser.Keyboard.O);
  squareDown = game.input.keyboard.addKey(Phaser.Keyboard.L);
  squareFire = game.input.keyboard.addKey(Phaser.Keyboard.P);

  prevCamX = game.camera.x;

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
  var laser = lasers.getFirstExists(true);
  resetLaser(laser);
  object.proportion = object.proportion * 1.25;
  if (object.proportion > 2) {
    object.kill();
    object.proportion = 0.5;
  }
  object.scale.setTo(object.proportion);

}
var inputDelta = 0;

function update() {
  inputDelta++;
  square.angle += 2;
  circle.angle += 2;



  if (this.game.physics.arcade.collide(circle, lasers, null, null, this)) {
    if (lasers.laserType !== "circle") {
      collideDetect(circle, "circle");
    }
  }
  if (this.game.physics.arcade.collide(square, lasers, null, null, this)) {
    if (lasers.laserType !== "square") {
      collideDetect(square, "square");
    }
  }

  // Circle Buttons
  if (circleFire.isDown && inputDelta > 60) {
    inputDelta = 0;
    if (lasers.laserType == "square") {
      fireLaser(circle, (-3000), "circle");
    }
  }
  if (circleUp.isDown) {
    if (circle.y >= 0) {
      circle.y -= 10;
    }
  } else if (circleDown.isDown) {
    if (circle.y <= windowY) {
      circle.y += 10;
    }
  }

  // Square Buttons
  if (squareFire.isDown && inputDelta > 60) {
    inputDelta = 0;
    if (lasers.laserType == "circle") {
      fireLaser(square, 3000, "square");
    }
  }
  if (squareUp.isDown) {
    if (square.y >= 0) {
      square.y -= 10;
    }
  } else if (squareDown.isDown) {
    if (square.y <= windowY) {
      square.y += 10;
    }
  }

  prevCamX = game.camera.x;
}
