/*global Phaser*/
let player, ball, violetBricks, yellowBricks, redBricks, cursors;
let gameStarted = false;
let openingText, controlText, gameOverText, playerWonText, scoreText, layerText,
  livesText, lvlMessage;
export default class bakeGame extends Phaser.Scene {
  constructor () {
    super('bakeGame');
  }

  init (data) {
    this.rollScore = data.rollScore;
    this.ingredientScore = data.ingredientScore;
    this.mixingScore = data.mixingScore;
    this.bakingScore = data.bakingScore;
    this.volume = data.volume;

  }

  preload () {
    // Preload assets
    this.load.image('ball', 'assets/images/ball_32_32.png');
    this.load.image('paddle', 'assets/images/baking_tray.png');
    this.load.image('brick1', 'assets/images/brick1_64_32.png');
    this.load.image('brick2', 'assets/images/brick2_64_32.png');
    this.load.image('brick3', 'assets/images/brick3_64_32.png');
    this.load.image("backsplash", "./assets/images/oven.jpg");
    this.load.image("oven", "./assets/images/oven_bg.png");
    this.load.image("counter", "./assets/images/kitch_counter.png");
    this.load.audio('music', './assets/music/Onion Capers.mp3');
    this.load.audio("beep","./assets/sounds/shortbeep.wav");
    this.load.audio("break","./assets/sounds/beepdown.wav");
    this.load.audio('music', './assets/music/Onion Capers.mp3');

    this.load.spritesheet("options", "./assets/spriteSheets/opt_button.png", {
      frameWidth: 426,
      frameHeight: 183
    });
    this.load.spritesheet("finishButton", "./assets/spriteSheets/finish_button.png", {
      frameWidth: 426,
      frameHeight: 183
    });
    this.load.spritesheet("menuBut", "./assets/spriteSheets/menu_button.png", {
      frameWidth: 426,
      frameHeight: 183
    });

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    this.score = 0;
    this.layer = 1;
    this.lives = 3;
  }

  create (data) {
    //transition button
    this.moveButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    this.background = this.add.sprite(this.centerX,this.centerY,'backsplash');
    this.oven = this.add.sprite(this.centerX,this.centerY,'oven');
    this.oven.setScale(1, 1.2);

    //OPTIONS BUTTON
    this.options = this.add.sprite(135, 580, "options", 0).setScale(0.2).setInteractive();
    this.options.on("pointerover", function () {
      this.setFrame(1);
    });
    this.options.on("pointerout", function() {
      this.setFrame(0);
    });
    this.options.on("pointerup", function() {
      this.options.setFrame(2);
      this.music.stop();
      this.time.addEvent({
        delay: 100,
        callback: () => this.scene.start('options', {rollScore: this.rollScore, ingredientScore: this.ingredientScore,
           mixingScore: this.mixingScore, bakingScore:this.score, volume: this.volume, returnScene: 4})
      });
    }, this
  );

    this.menu = this.add.sprite(50, 580, "menuBut", 0).setScale(0.2).setInteractive();
    this.menu.on("pointerover", function () {
      this.setFrame(1);
    });
    this.menu.on("pointerout", function() {
      this.setFrame(0);
    });
    this.menu.on("pointerup", function() {
      this.menu.setFrame(2);
      this.time.addEvent({
        delay: 100,
        callback: () => this.scene.start("menu", {music: this.music.stop(), volume: this.volume})
      });
    }, this
  );

    //play music
    this.music = this.sound.add('music');
    this.music.play({ loop: true, volume: this.volume});﻿

    openingText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      'Press SPACE to Start',
      {
        fontFamily: 'Skia',
        fontSize: '50px',
        fill: '#fff',
        align:'center',
      }
    );

    controlText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2 + 50 ,
      'Control the paddle with the arrow keys!',
      {
        fontFamily: 'Skia',
        fontSize: '30px',
        fill: '#fff',
      }
    );

    openingText.setOrigin(0.5);
    controlText.setOrigin(0.5);
    // Create game over text
    gameOverText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      'Game Over',
      {
        fontFamily: 'Skia',
        fontSize: '50px',
        fill: '#fff'
      }
    );

    gameOverText.setOrigin(0.5);

    // Make it invisible until the player loses
    gameOverText.setVisible(false);

    // Create the game won text
    playerWonText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      'You won!',
      {
        fontFamily: 'Skia',
        fontSize: '50px',
        fill: '#fff'
      }
    );

    playerWonText.setOrigin(0.5);

    // Make it invisible until the player wins
    playerWonText.setVisible(false);

    scoreText = this.add.text(
      40,
      460,
      "Score: "+this.score,
      {
        fontFamily: 'Skia',
        fontsize:'30px',
        fill: '#fff'
      }
    );

    layerText = this.add.text(
      40,
      440,
      "Layer: "+this.layer,
      {
        fontFamily: 'Skia',
        fontsize:'30px',
        fill: '#fff'
      }
    );

    livesText = this.add.text(
      40,
      420,
      "Lives: "+this.lives,
      {
        fontFamily: 'Skia',
        fontsize:'30px',
        fill: '#fff'
      }
    );

    lvlMessage = this.add.text(this.physics.world.bounds.width / 2,
          this.physics.world.bounds.height / 2,"Moving on to the next layer...",
      {
        fontFamily: 'Skia',
        fontsize:'50px',
        fill: '#fff'
      });
    lvlMessage.setOrigin(0.5);

    this.flavortext = this.add.text(this.physics.world.bounds.width / 2,
          this.physics.world.bounds.height / 2 + 50, "Baking your order...",
          {fontSize: '20px', fontFamily:'Skia',fill: '#fff'})
          .setOrigin(0.5);

    // Make it invisible until the player wins
    lvlMessage.setVisible(false);
    this.flavortext.setVisible(false);

    player = this.physics.add.sprite(
      400, // x position
      540, // y position
      'paddle' // key of image for the sprite
    );
    player.setSize(180,20);
    player.setBounce(0.3,0.3);


    ball = this.physics.add.sprite(
      400, // x position
      505, // y position
      'ball' // key of image for the sprite
    );
    ball.setSize(30,30);

    violetBricks = this.physics.add.group({
      key: 'brick1',
      repeat: 9,
      immovable: true,
      setXY: {
        x: 80,
        y: 140,
        stepX: 70
      }
    });

    // Add yellow bricks
    yellowBricks = this.physics.add.group({
      key: 'brick2',
      repeat: 9,
      immovable: true,
      setXY: {
        x: 80,
        y: 90,
        stepX: 70
      }
    });

    // Add red bricks
    redBricks = this.physics.add.group({
      key: 'brick3',
      repeat: 9,
      immovable: true,
      setXY: {
        x: 80,
        y: 40,
        stepX: 70
      }
    });
    cursors = this.input.keyboard.createCursorKeys();
    player.setCollideWorldBounds(true);
    ball.setCollideWorldBounds(true);
    ball.setBounce(1, 1);
    this.physics.world.checkCollision.down = false;
    this.physics.add.collider(ball, violetBricks, hitBrick, null, this);
    this.physics.add.collider(ball, yellowBricks, hitBrick, null, this);
    this.physics.add.collider(ball, redBricks, hitBrick, null, this);
    this.physics.add.collider(ball, player, hitPlayer, null, this);
    player.setImmovable(true);
    //transition button
    this.moveButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.moveButton.enabled = false;

    this.nextSButton = this.add.sprite(this.centerX + 1000, this.centerY + 750,
    "finishButton");
    this.nextSButton.setScale(0.3);
    this.nextSButton.setInteractive();
    this.goToNextScene();
  }

  update (time, delta) {
    // Check if the ball left the scene i.e. game over
    if (isGameOver(this.physics.world)) {
      // TODO: Show "Game over" message to the player
      ball.disableBody(true, true);
      if (this.lives == 0){
        gameOverText.setVisible(true);
        this.flavortext.setVisible(true);
        this.tweens.add({
          targets: this.nextScene,
          x: 400,
          y: 560,
          ease: "Quad",
          duration: 800
        });
        this.tweens.add({
          targets: this.nextSButton,
          x: 730,
          y: 560,
          ease: "Quad",
          duration: 800
        });
      }
      else{
        //allow retry
        this.lives -= 1;
        this.score -= 200;
        scoreText.setText('Score: '+this.score);
        livesText.setText("Lives: "+this.lives);
        ball.enableBody(true,player.x, 505,true,true);
        gameStarted = false;
      }

    } else if (isWon()) {
      // TODO: Show "You won!" message to the player
      ball.disableBody(true, true);
      //restart game and go to new layer

      if (this.layer < 2){
        lvlMessage.setVisible(true);
        this.nextLevel = this.time.addEvent({
          delay: 3000,
          callback:function(){
            this.layer += 1;
            layerText.setText("Layer: "+this.layer);
            ball.enableBody(true,player.x, 505,true,true);
            lvlMessage.setVisible(false);
            gameStarted = false;
          },
          callbackScope: this,
          loop: false,
        });
        violetBricks = this.physics.add.group({
          key: 'brick1',
          repeat: 9,
          immovable: true,
          setXY: {
            x: 80,
            y: 140,
            stepX: 70
          }
        });
        // Add yellow bricks
        yellowBricks = this.physics.add.group({
          key: 'brick2',
          repeat: 9,
          immovable: true,
          setXY: {
            x: 80,
            y: 90,
            stepX: 70
          }
        });
        // Add red bricks
        redBricks = this.physics.add.group({
          key: 'brick3',
          repeat: 9,
          immovable: true,
          setXY: {
            x: 80,
            y: 40,
            stepX: 70
          }
        });
        this.physics.add.collider(ball, violetBricks, hitBrick, null, this);
        this.physics.add.collider(ball, yellowBricks, hitBrick, null, this);
        this.physics.add.collider(ball, redBricks, hitBrick, null, this);
      }
      else{
        playerWonText.setVisible(true);
        this.flavortext.setVisible(true);
        this.tweens.add({
          targets: this.nextScene,
          x: 400,
          y: 560,
          ease: "Quad",
          duration: 800
        });
        this.tweens.add({
          targets: this.nextSButton,
          x: 730,
          y: 560,
          ease: "Quad",
          duration: 800
        });
      }

    } else {
      // TODO: Logic for regular game time
      const speed = 1200;
      player.body.setAcceleration(0);
      player.body.setDrag(speed+speed);

      if (cursors.left.isDown) {
        player.body.setAccelerationX(-speed);
      } else if (cursors.right.isDown) {
        player.body.setAccelerationX(speed);
      }
      if (!gameStarted) {
        ball.setX(player.x);

        if (cursors.space.isDown) {
          gameStarted = true;
          ball.setVelocityY(-250);
          openingText.setVisible(false);
          gameOverText.setVisible(false);
          controlText.setVisible(false);
          lvlMessage.setVisible(false);
          this.sound.play("beep");
        }
      }

    }
  }

  goToNextScene() {
    this.nextSButton.on("pointerover", function () {
      this.setFrame(1);
    });
    this.nextSButton.on("pointerout", function() {
      this.setFrame(0);
    });
    this.nextSButton.on("pointerdown", function() {
      gameStarted = false;
      this.nextSButton.setFrame(2);
      this.music.stop();
      // this.bLeftTween.stop();
      // this.bRightTween.stop();
      this.time.addEvent({
        // callback:() => this.scene.stop("mixingScene"),
        // delay: 10,
        callback: () => this.scene.start("finish",{rollScore: this.rollScore, ingredientScore: this.ingredientScore, mixingScore: this.mixingScore, volume:this.volume, bakingScore: this.score})
      });
    }, this
  );
  }

}

function isWon() {
  return violetBricks.countActive() + yellowBricks.countActive() + redBricks.countActive() === 0;
}
function isGameOver(world) {
  return ball.body.y > world.bounds.height;
}
function hitBrick(ball, brick) {
  brick.disableBody(true, true);
  this.score += 100;
  scoreText.setText('Score: '+this.score);
  this.sound.play("break");

  if (ball.body.velocity.x === 0) {
    let randNum = Math.random();
    if (randNum >= 0.5) {
      ball.body.setVelocityX(150);
    } else {
      ball.body.setVelocityX(-150);
    }
  }
}
function hitPlayer(ball, player) {
  // Increase the velocity of the ball after it bounces
  if (ball.body.velocity.y <= -600) {
    ball.setVelocityY(ball.body.velocity.y);
  }
  else{
    ball.setVelocityY(ball.body.velocity.y - 5);
  }
  this.sound.play("beep");

  var newXVelocity = Math.abs(ball.body.velocity.x) + 20;
  if (ball.body.velocity.x >= 300){
    newXVelocity = ball.body.velocity.x;
  }
  // If the ball is to the left of the player, ensure the X-velocity is negative
  if (ball.x < player.x) {
    ball.setVelocityX(-newXVelocity);
  } else {
    ball.setVelocityX(newXVelocity);
  }
}
