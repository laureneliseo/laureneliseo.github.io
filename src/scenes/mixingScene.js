/*global Phaser*/
import * as debugging from "../prefabs/debugButtons.js";
export default class mixing extends Phaser.Scene {
  constructor () {
    super('mixing');
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
    this.load.image("background", "./assets/images/background.png");
    this.load.image("backsplash", "./assets/images/backsplash.png");
    this.load.image("counter", "./assets/images/kitch_counter.png");
    this.load.image('stirBowl','./assets/images/bowl_stir.png');
    this.load.image("box", "./assets/images/whatyouremaking.png");
    this.load.image("spoon", "./assets/images/spoon.png");
    this.load.image("tint", "./assets/images/tint.png");
    this.load.image("popup", "./assets/images/popup.png");
    this.load.image("strBrEx", "./assets/images/stirBar_example.png");

    this.load.spritesheet("stirBarGroup", "./assets/spriteSheets/stirBar_sheet.png", {
      frameWidth: 96,
      frameHeight: 35.66
    });
    this.load.spritesheet("spacebar", "./assets/spriteSheets/spacebar_spritesheet.png", {
      frameWidth: 334,
      frameHeight: 168
    });
    this.load.spritesheet("menuScreen", "./assets/spriteSheets/menu_button.png", {
      frameWidth: 426,
      frameHeight: 183
    });
    this.load.spritesheet("options", "./assets/spriteSheets/opt_button.png", {
      frameWidth: 426,
      frameHeight: 183
    });
    this.load.spritesheet("next", "./assets/spriteSheets/next_button.png", {
      frameWidth: 426,
      frameHeight: 183
    });

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    this.load.audio('music', './assets/music/Onion Capers.mp3');
    this.load.audio('correct', './assets/sounds/correct.mp3');
    this.load.audio('wrong', './assets/sounds/wrong.wav');
  }

  create (data) {

    //play music
    this.music = this.sound.add('music');
    this.music.play({ loop: true, volume: this.volume });
    this.isStirred = false;
    this.correct = this.sound.add("correct");
    this.wrong = this.sound.add("wrong");

    //Create the scene
    //Add background to scene
    const background = this.add.sprite(800 / 2, 600 / 2, "backsplash");
    this.add.sprite(800 / 2, 500, "counter").setScale(1, 1.5);

    //add debugButtons scene event listeners
    debugging.debugButtons(this, false, true, false, false, false, false);

    //Add bowl sprite
    this.bowl = this.add.sprite(this.centerX, this.centerY - 20, 'stirBowl');
    this.bowl.setScale(0.4);

    //Add text box and spoon slider box
    var textBox = this.add.sprite(this.centerX, this.centerY - 200, "box");
    textBox.setScale(1.8,0.6);
    var mixSlider = this.physics.add.sprite(this.centerX, this.centerY + 200, "box");
    mixSlider.setScale(1.5,0.3);

    //add variables for spoon travel range and spoon speed
    this.spoonRange = [-250, 250];
    this.spoonSpeed = 4000;
    //create score and text variable to show live score in scene
    this.stirScore = 0;
    this.scoreText = this.add.text(this.centerX + 270, this.centerY - 280,
      "Score: " + this.stirScore, {
        fontSize: 20,
        color: "black",
        fontFamily:'Skia',
      });

    //create spacebar
    this.arrowKeys();
    this.leftTurn = true;
    this.rightTurn = false;

    //add stirBar that randomly appears along the spoon slider box
    this.createStirBar();

    //Add in-scene text instructions
    this.instruct = this.add.text(this.centerX - 100, this.centerY - 215,
      "Press space to stir!", {
        fontSize: 24,
        fontFamily: "Skia",
        color: "black"
      });

    //Add spoon and stir counters
    this.spoon = this.physics.add.sprite(
      this.centerX - this.spoonRange[0],
      this.centerY + 177,
      "spoon"
    );
    this.spoon.setScale(0.3).setDepth(1);
    //resize spoon collision box
    this.spoon.setSize(50, 120, true).setOffset(50, 160);
    //create spoon tween
    this.spoonTween = this.tweens.add({
      targets: this.spoon,
      x: this.centerX - this.spoonRange[1],
      duration: this.spoonSpeed,
      yoyo: true,
      repeat: 20,
    });
    this.spoonTween.pause();

    //add popup with instructions and start button
    this.instructions();

    //add collision between slider areas and spoon
    this.noneOn = true;
    this.greenLap = this.physics.add.overlap(this.spoon, this.greenArea, this.checkSpoonCollision, null, this);
    this.ylwLap = this.physics.add.overlap(this.spoon, this.yellowArea, this.checkSpoonCollision, null, this);
    this.redLap = this.physics.add.overlap(this.spoon, this.redArea, this.checkSpoonCollision, null, this);

    this.stirCount = 0;

    //Add text to prompt player to change scenes
    // this.nextScene = this.add.text(this.centerX + 1000, this.centerY + 750,
    // "Press to go to next stage ->", {
    //   fontSize: 16,
    //   color: "black"
    // });
    this.nextSButton = this.add.sprite(this.centerX + 1000, this.centerY + 750,
    "next");
    this.nextSButton.setScale(0.3);
    this.nextSButton.setInteractive();
    this.goToNextScene();

    //OPTIONS BUTTON
    this.options = this.add.sprite(50, 60, "options", 0).setScale(0.2).setInteractive();
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
           mixingScore: this.stirScore, bakingScore:this.bakingScore, volume: this.volume, returnScene: 2})
      });
    }, this
  );

  }

  update (time, delta) {
    // Update the scene
    this.stirringPhase();
    this.redOn = false;
    this.noneOn = true;
  }

  stirringPhase() {
    //Create cursor keys and assign events
    this.cursors = this.input.keyboard.createCursorKeys();

    if (this.stirCount >= 7) {
      //player has stirred enough times
      //reset bowl rotation and change instruction text
      this.tweens.add({
        targets: this.bowl,
        rotation: 0,
        ease: "Cubic",
        duration: 200
      });
      this.instruct.x = this.centerX - 50;
      this.instruct.text = (this.centerX - 100, this.centerY - 215, "You did it!");

      //prompt player to go to next scene with animated text and button
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

      this.spoonTween.ease = "Quad";
      this.spoonTween.yoyo = false;
      this.spoonTween.repeat = 0;
      this.spoonTween.stop();
      this.isStirred = true;
      return this.isStirred;

    }

    else {
      if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(32))) {
        //show key being pressed
        this.bLeft.anims.play("bLeft", true);

        //check where spoon is colliding
        if (this.noneOn == true) {
          //spoon has hit nothing
          //play incorrect sound
          this.wrong.play();

          if (this.leftTurn == true) {
            //shake bowl back and forth to the right
            this.tweens.add({
              targets: this.bowl,
              x: this.centerX + 20,
              ease: "Bounce",
              duration: 200,
              yoyo: true
            });
          }

          if (this.rightTurn == true) {
            //shake bowl back and forth to the left
            this.tweens.add({
              targets: this.bowl,
              x: this.centerX - 20,
              ease: "Bounce",
              duration: 200,
              yoyo: true
            });
          }

        }

        else {
          //spoon hit the stir bar

          if (this.rightTurn == true) {
            //jiggle bowl right/clockwise
            this.tweens.add({
              targets: this.bowl,
              rotation: 0.2,
              ease: "Cubic",
              duration: 200,
              yoyo: true
            });
          }

          if (this.leftTurn == true) {
            //jiggle bowl left/counterclockwise
            this.tweens.add({
              targets: this.bowl,
              rotation: -0.2,
              ease: "Cubic",
              duration: 200,
              yoyo: true
            });
          }

          //play correct sound
          // this.correct.play();
          //add one to right stir counter
          this.stirCount++;

          //update score
          this.pointsAwarder();
          this.scoreText.setText('Score: ' + this.stirScore);

          this.spoonMove();
          this.sliderMove();
        }
        //switch animations
        this.rightTurn = !this.rightTurn;
        this.leftTurn = !this.leftTurn;
      }
    }
  }

  spoonMove() {
    this.spoonTween.stop();
    this.spoonTween.remove();
    this.spoonSpeed -= 500;

    if (this.spoon.x <= 400) {
      this.spoonReset = this.add.tween({
        targets: this.spoon,
        x: 660,
        duration: 500
      });
    }

    else if (this.spoon.x > 400) {
      this.spoonReset = this.add.tween({
        targets: this.spoon,
        x: 660,
        duration: 300
      });

      if (!this.spoonReset.isPlaying){
        this.spoonReset.remove();
      }
    }

    this.spoonTween = this.tweens.add({
      targets: this.spoon,
      x: this.centerX - this.spoonRange[1],
      duration: this.spoonSpeed,
      yoyo: true,
      repeat: 20,
      delay: 500
    });

  }

  arrowKeys() {
    this.bLeft = this.add.sprite(400, 400, "spacebar", 0);
    this.bLeft.setScale(0.4, 0.3);

    //create bracket tweens to bounce the buttons & play forever
    this.bLeftTween = this.tweens.add({
      targets: this.bLeft,
      y: this.bLeft.y - 2,
      ease: "Bounce",
      duration: 400,
      yoyo: true,
      repeat: -1
    });

    //create spacebar animations to play when pressed
    this.anims.create({
      key: "bLeft",
      frames: this.anims.generateFrameNumbers("spacebar", { start: 0, end: 1 }),
      frameRate: 10,
      yoyo: true
    });
  }

  createStirBar() {
    //stirBar contains multiple sprites with collisions

    //create stirBar sprites of different sizes
    //red area awards the least amount of points
    this.redD = this.physics.add.sprite(
      this.randomInSlider(),
      this.centerY + 1500,
      "stirBarGroup",
      0
    );
    this.redD.setScale(1.5, 0.8);

    this.redArea = this.physics.add.group({
      key: "stirBarGroup",
      frame: 0,
      repeat: 1,
      setScale: {
        x: 0.25,
        y: 0.8
      },
      setXY: {
        x: this.redD.x - 61,
        y: this.centerY + 200,
        stepX: 120
      }
    });

    //yellow area awards half of full points
    this.yellowArea = this.physics.add.group({
      key: "stirBarGroup",
      frame: 1,
      repeat: 1,
      setScale: {
        x: 0.3,
        y: 0.8
      },
      setXY: {
        x: this.redD.x - 34,
        y: this.centerY + 200,
        stepX: 68
      }
    });

    //green area awards 1/4 of full points
    this.greenArea = this.physics.add.sprite(
      this.redD.x,
      this.centerY + 200,
      "stirBarGroup",
      2
    );
    this.greenArea.setScale(0.4, 0.8);
  }

  sliderMove() {
    //remove old stirBar collisions
    this.greenLap.destroy();
    this.ylwLap.destroy();
    this.redLap.destroy();
    //remove old stirBar sprites
    this.redD.destroy();
    this.redArea.destroy(true);
    this.yellowArea.destroy(true);
    this.greenArea.destroy(true);

    //add stirBar at random spot along mixSlider
    this.createStirBar();
    //add stirBar collisions
    this.greenLap = this.physics.add.overlap(this.spoon, this.greenArea, this.checkSpoonCollision, null, this);
    this.ylwLap = this.physics.add.overlap(this.spoon, this.yellowArea, this.checkSpoonCollision, null, this);
    this.redLap = this.physics.add.overlap(this.spoon, this.redArea, this.checkSpoonCollision, null, this);
  }

  randomInSlider() {
    //generate random x coordinates for stirBar to be placed within the mixSlider
    this.stirBarX = Phaser.Math.Between(210, 590);
    return this.stirBarX;
  }

  checkSpoonCollision(spoon, zone) {
    //flag areas of collision as true when spoon hits them
    //flag areas of collision as false if spoon did not hit them

    //no frame – Miss, 0 points awarded
    //frame 0 (red) – OK, 1/4 of full Points awarded
    //frame 1 (yellow) – Good, 1/2 of full Points awarded
    //frame 2 (green) – Great!, Full Points Awarded

    if (zone.frame.name == 2) {
      //green area overlap
      this.noneOn = false;
      this.redOn = false;
      this.yellowOn = false;
      this.greenOn = true;
    }
    else if (zone.frame.name == 1) {
      //yellow area overlap
      this.noneOn = false;
      this.redOn = false;
      this.greenOn = false;
      this.yellowOn = true;
    }
    else if (zone.frame.name == 0) {
      //red area overlap
      this.noneOn = false;
      this.yellowOn = false;
      this.redOn = true;
    }
    else {
      //no overlap
      this.redOn = false;
      this.noneOn = true;
    }
  }

  pointsAwarder() {
    if (this.greenOn == true && this.yellowOn == false) {
      //player hit the green area of the stir bar and get full points
      this.stirScore += 200;
      //play correct sound
      this.correct.play({rate:0.4});
      return this.stirScore;
    }
    else if (this.yellowOn == true && this.greenOn == false && this.redOn == false) {
      //player hit the yellow area of the stir bar and get half points
      this.stirScore += 100;
      //play correct sound at lower pitch
      this.correct.play({rate: 0.8});
      return this.stirScore;
    }
    else if (this.noneOn == false && this.redOn == true && this.yellowOn == false) {
      //player hit the red area of the stir bar and get 1/4 points
      this.stirScore += 50;
      //play correct sound at lowest pitch
      this.correct.play({rate:2});
      return this.stirScore;
    }
    else {
      //player hit nothing and gets no points
      return this.stirScore;
    }
  }

  instructions() {
    //create popup with instructions and start button
    var tint = this.add.sprite(this.centerX, this.centerY, "tint");
    tint.setScale(2).setDepth(1);
    var popup = this.add.sprite(this.centerX, this.centerY, "popup");
    popup.setScale(2, 1.5).setDepth(1);
    var strEx = this.add.image(this.centerX + 230, this.centerY + 75, "strBrEx");
    strEx.setScale(0.4).setDepth(1);
    var spnEx = this.add.image(this.centerX + 230, this.centerY - 25, "spoon");
    spnEx.setScale(0.25).setDepth(1);
    var lEx = this.add.sprite(this.centerX + 230, this.centerY - 100, "spacebar", 0);
    lEx.setScale(0.3).setDepth(1);
    var popinst = this.add.text(210, this.centerY - 210,
      "Stir your ingredients!", {
        fontSize: 55,
        fontFamily: "SignPainter",
        color: "#745375",
        align: "center"
      }).setDepth(1);
    var popinst01 = this.add.text(120, this.centerY - 130,
      "Try to hit the spoon along the target\nusing the spacebar.", {
        fontSize: 25,
        fontFamily: "Skia",
        color: "black",
        align: "right"
      }).setDepth(1);
    var popinst1 = this.add.text(149, this.centerY - 50,
      "On each hit, the spoon will return\nto the start and speed up!", {
        fontSize: 25,
        fontFamily: "Skia",
        color: "black",
        align: "right"
      }).setDepth(1);
    var popinst2 = this.add.text(175, this.centerY + 62,
      "Hit", {fontSize: 25, fontFamily: "Skia", align: "right",
        color: "black"
      }).setDepth(1);
    var popinst3 = this.add.text(220, this.centerY + 62,
      "green", {
        fontSize: 25,
        fontFamily: "Skia",
        color: "green",
        align: "right"
      }).setDepth(1);
    var popinst4 = this.add.text(290, this.centerY + 35,
      "\nfor the most points!", {fontSize: 25, fontFamily: "Skia", align: "right",
        color: "black",
      }).setDepth(1);

    var saidOK = false;
    var okButton = this.add.sprite(this.centerX, this.centerY + 180, "start", 0);
    okButton.setScale(0.4).setDepth(1);
    okButton.setInteractive();
    okButton.on("pointerover", function () {
      this.setFrame(1);
    });
    okButton.on("pointerout", function() {
      this.setFrame(0);
    });
    okButton.on("pointerup", function() {
      okButton.setFrame(2);
      saidOK = true;
      if (saidOK == true) {
        //remove popup when start button is pressed
        tint.destroy();
        strEx.destroy();
        spnEx.destroy();
        lEx.destroy();
        popup.destroy();
        popinst.destroy();
        popinst01.destroy();
        popinst1.destroy();
        popinst2.destroy();
        popinst3.destroy();
        popinst4.destroy();
        okButton.destroy();
        //start spoon movement
        this.spoonTween.play();
      }
    }, this);
  }

  goToNextScene() {
    if (this.registry.get('type')=='cake'){

      this.nextSButton.on("pointerover", function () {
        this.setFrame(1);
      });
      this.nextSButton.on("pointerout", function() {
        this.setFrame(0);
      });


      this.nextSButton.on("pointerdown", function() {
        this.nextSButton.setFrame(2);
        this.music.stop();
        this.time.addEvent({
          callback: () => this.scene.start("bakeGame",{rollScore: this.rollScore, ingredientScore: this.ingredientScore, mixingScore: this.stirScore, volume: this.volume, bakingScore: this.bakingScore})
        });
      }, this
    );}
    else {
      this.nextSButton.on("pointerover", function () {
        this.setFrame(1);
      });
      this.nextSButton.on("pointerout", function() {
        this.setFrame(0);
      });
      this.nextSButton.on("pointerdown", function() {
        this.nextSButton.setFrame(2);
        this.music.stop();
        this.time.addEvent({
          callback: () => this.scene.start("roll",{rollScore: this.rollScore, ingredientScore: this.ingredientScore, mixingScore: this.stirScore, volume: this.volume, bakingScore: this.bakingScore})
        });
      }, this
    );}

  }

}
