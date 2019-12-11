/*global Phaser*/
import * as debugging from "../prefabs/debugButtons.js";

export default class roll extends Phaser.Scene {
  constructor () {
    super('roll');
  }

  init(data){
    this.rollScore = data.rollScore;
    this.ingredientScore = data.ingredientScore;
    this.mixingScore = data.mixingScore;
    this.bakingScore = data.bakingScore;
    this.volume = data.volume;

  }

  preload () {

    // Preload assets
    this.load.image("backsplash", "./assets/images/backsplash.png");
    this.load.image("counter", "./assets/images/kitch_counter.png");
    this.load.image("box", "./assets/images/whatyouremaking.png");
    this.load.image("tray", "./assets/images/roll_tray.png");

    this.load.audio('correct', './assets/sounds/correct.mp3');
    this.load.audio('wrong2', './assets/sounds/doughKey.mp3');

    this.load.image("still dough", "./assets/images/dough/normal_dough.png");
    this.load.image("left dough", "./assets/images/dough/left_dough.png");
    this.load.image("right dough", "./assets/images/dough/right_dough.png");
    this.load.image("up dough", "./assets/images/dough/up_dough.png");
    this.load.image("down dough", "./assets/images/dough/down_dough.png");

    this.load.spritesheet("menuScreen", "./assets/spriteSheets/menu_button.png", {
      frameWidth: 426,
      frameHeight: 183
    });
    this.load.spritesheet("options", "./assets/spriteSheets/opt_button.png", {
      frameWidth: 426,
      frameHeight: 183
    });

    this.load.audio('music', './assets/music/Onion Capers.mp3');

    this.load.spritesheet("arrowkeys", "./assets/spriteSheets/arrow_keys_spritesheet.png", {
      frameWidth: 168,
      frameHeight: 168.5
    });
    this.load.spritesheet("next", "./assets/spriteSheets/next_button.png", {
      frameWidth: 426,
      frameHeight: 183
    });


    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    this.timer = 33;
    this.score = 0;
  }

  create (data) {
    //play music
    this.music = this.sound.add('music');
    this.music.play({ loop: true, volume: this.volume});﻿

    //Create the scene
    const background = this.add.sprite(this.centerX, this.centerY, "backsplash");
    var counter = this.add.sprite(this.centerX, this.centerY + 50, "counter");
    counter.setScale(1, 2);
    //tray
    this.add.sprite(this.centerX + 145, this.centerY - 45, "tray").setScale(1.1);

    // set up i for itterations
    this.j = 1;

    //Instructions
    this.instructions();

    //add debugButtons scene event listeners
    debugging.debugButtons(this, false, true, false, false, false, false);

    this.timerText = this.add.text(560,40,'Time: '+ this.timer,{color:'black',fontSize:30, fontFamily:'Skia'});
    this.scoreText = this.add.text(560,80,'Score: '+ this.score,{color:'black',fontSize:30, fontFamily:'Skia'});
    this.inputPrompt = this.add.text(50,350,'',{color:'black',fontSize:25});

    this.startButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.stopButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    // next scene button
    this.nButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);

    this.cursors = this.input.keyboard.createCursorKeys();

    //dough scale rates
    this.doughScaleS = 0.1;
    this.doughScaleL = 0.3;
    //create dough
    this.dough = this.add.image(this.centerX + 150, this.centerY - 50, "still dough");
    this.dough.setScale(0.3);
    this.leftDough = this.add.image(this.centerX + 150, this.centerY - 50, "left dough")
      .setScale(0.1);
    this.rightDough = this.add.image(this.centerX + 150, this.centerY - 50, "right dough")
      .setScale(0.1);
    this.upDough = this.add.image(this.centerX + 150, this.centerY - 50, "up dough")
      .setScale(0.1);
    this.downDough = this.add.image(this.centerX + 150, this.centerY - 25, "down dough")
      .setScale(0.1);

    this.arrowButtons();

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
        callback: () => this.scene.start('options', {rollScore: this.score, ingredientScore: this.ingredientScore,
           mixingScore: this.mixingScore, bakingScore:this.bakingScore, volume: this.volume, returnScene: 3})
      });
    }, this
  );

  }

  update() {

    // replace with button
    if(this.timer == 0){
      this.cursors.enabled = false;
      //prompt player to go to next scene with animated text
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

    if (Phaser.Input.Keyboard.JustDown(this.startButton)) {
      if (this.timer <= 0){

      }
      else {
        //timer
        this.timePrompt = this.time.addEvent({
          delay:1000,
          callback: function(){
            this.timer --;
            this.timerText.setText('Time: ' +this.timer);
            if (this.timer <= 0){
              this.timePrompt.remove();
              this.keyPrompt.remove();
            }
          },
          callbackScope: this,
          loop:true
        });
        //this.combomake();
        //gives combo input every 3 seconds after 6 seconds
        this.keyPrompt = this.time.addEvent({
          delay:3000,
          callback:function() {
            //up = 38
            //down = 40
            //left = 37
            //right = 39
            let combos = [this.randomIntFromInterval(37,40),this.randomIntFromInterval(37,40)];
            //progressing difficulty
            if (this.score > 2800){
              combos.push(this.randomIntFromInterval(37,40));
            }
            if (this.score > 2000){
              combos.push(this.randomIntFromInterval(37,40));
            }
            if (this.score > 1200){
              combos.push(this.randomIntFromInterval(37,40));
            }
            if (this.score > 200){
              combos.push(this.randomIntFromInterval(37,40));
            }

            // create a combos randomly
            let doughcombo = this.shuffle(combos);
            let inputlist = [];
            for (const i of doughcombo) {
              switch(i) {
                case 38:
                  inputlist.push(0);
                  break;
                case 40:
                  inputlist.push(6);
                  break;
                case 37:
                  inputlist.push(3);
                  break;
                case 39:
                  inputlist.push(9);
              }
            }
            //this function runs however many times it has gotten right

            // sets combo to be realized
            let makeIt = this.input.keyboard.createCombo(doughcombo, {
              resetOnWrongKey:true,
              deleteOnMatch: true,
              keyCodes: doughcombo
            });

            // creates comands to be displayed

            switch(inputlist.length){
              case 4:
                let key4 = this.add.sprite(700,450,"arrowkeys",inputlist[3]).setScale(0.4);
              case 3:
                let key3 = this.add.sprite(600,450,"arrowkeys",inputlist[2]).setScale(0.4);
              case 2:
                let key2 = this.add.sprite(500,450,"arrowkeys",inputlist[1]).setScale(0.4);
              case 1:
                let key1 = this.add.sprite(400,450,"arrowkeys",inputlist[0]).setScale(0.4);
            }
            //this function runs however many times it has gotten right
            // where is the condition to run this
            this.input.keyboard.on('keycombomatch',function(event) {

              this.j = this.j + 1;

              // if (this.input.keyboard != this.inputlist[this.j]){
              //   this.sound.play("wrong");}


              if (this.j == doughcombo.length){
                this.score += (100);
                this.scoreText.setText('Score: '+this.score);
                this.sound.play("wrong2", {volume: 0});
                this.sound.play("correct");
                this.j = 0;

                //increase dough size after correct combo
                this.doughScaleS += 0.1;
                this.doughScaleL += 0.1;
                if (this.doughScaleL >= 0.7 && this.doughScaleS >= 0.5) {
                  //don't increase dough past certain scale
                  this.doughScaleS = 0.5;
                  this.doughScaleL = 0.7;
                }

                // go through combo to see if it is the last letter in combo
                for(const x of doughcombo){
                    // if (x == 37){
                      this.tweens.add({
                        targets: this.greenLeftKey,
                        alpha: {from: 0, to:1 },
                        yoyo:true,
                        duration:300
                      });

                    // }
                    // else if (x == 38){
                      this.tweens.add({
                      targets: this.greenUpKey,
                      alpha: {from: 0, to:1 },
                      yoyo:true,
                      duration:300
                    });
                  // }
                    // else if (x == 39){
                    this.tweens.add({
                      targets: this.greenRightKey,
                      alpha: {from: 0, to:1 },
                      yoyo:true,
                      duration:300
                    });
                  // }
                    // else if (x == 40){
                    this.tweens.add({
                      targets: this.greenDownKey,
                      alpha: {from: 0, to:1 },
                      yoyo:true,
                      duration:300
                    });

                  // }
                    //left = 37
                    //up = 38
                    //right = 39
                    //down = 40
                  }
                }
              else{
                this.j = 1;
                // this.sound.play("wrong");
              }

            },this);
          },
          callbackScope:this,
          loop:true
        });
      } //else statement inside if statement
      this.startButton.enabled = false;
    } //outside if statement
    //pause
    if (Phaser.Input.Keyboard.JustDown(this.stopButton)) {
        this.timePrompt.destroy();
        this.startButton.enabled = true;
    }

    //roll dough left
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.sound.play("wrong2", {volume: 1, rate: 2});
      if (this.doughScaleL == 0.3 || this.doughScaleS == 0.1) {
        this.doughTween(this.dough, this.doughScaleL, this.doughScaleL,
          this.centerX + 140, this.centerY - 50);
        this.doughTween(this.upDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 140, this.centerY - 60);
        this.doughTween(this.downDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 140, this.centerY - 25);
        this.doughTween(this.rightDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 140, this.centerY - 60);

        this.doughTween(this.leftDough, this.doughScaleL, this.doughScaleL,
          this.centerX + 140, this.centerY - 55);
      }

      else {
        this.doughTween(this.dough, this.doughScaleL, this.doughScaleL,
          this.centerX + 140, this.centerY - 50);
        this.doughTween(this.upDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 140, this.centerY - 60);
        this.doughTween(this.downDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 140, this.centerY - 25);
        this.doughTween(this.rightDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 140, this.centerY - 60);

        this.doughTween(this.leftDough, this.doughScaleL, this.doughScaleL,
          this.centerX + 140, this.centerY - 60);
      }

      this.leftKey.anims.play("leftKey", true);
    }

    //roll dough right
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.sound.play("wrong2", {volume: 1, rate: 2});
      if (this.doughScaleL == 0.3 || this.doughScaleS == 0.1) {
        this.doughTween(this.dough, this.doughScaleL, this.doughScaleL,
          this.centerX + 160, this.centerY - 50);
        this.doughTween(this.upDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 170, this.centerY - 55);
        this.doughTween(this.downDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 170, this.centerY - 25);
        this.doughTween(this.leftDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 170, this.centerY - 60);

        this.doughTween(this.rightDough, this.doughScaleL, this.doughScaleL,
          this.centerX + 170, this.centerY - 53);
      }

      else {
        this.doughTween(this.dough, this.doughScaleL, this.doughScaleL,
          this.centerX + 160, this.centerY - 50);
        this.doughTween(this.upDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 170, this.centerY - 60);
        this.doughTween(this.downDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 170, this.centerY - 25);
        this.doughTween(this.leftDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 170, this.centerY - 60);

        this.doughTween(this.rightDough, this.doughScaleL, this.doughScaleL,
          this.centerX + 170, this.centerY - 60);
      }

      this.rightKey.anims.play("rightKey", true);
    }

    //roll dough up
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.sound.play("wrong2", {volume: 1, rate: 2});
      if (this.doughScaleL == 0.3 || this.doughScaleS == 0.1) {
        this.doughTween(this.dough, this.doughScaleL, this.doughScaleL,
          this.centerX + 150, this.centerY - 60);
        this.doughTween(this.downDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 150, this.centerY - 40);
        this.doughTween(this.leftDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 150, this.centerY - 68);
        this.doughTween(this.rightDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 150, this.centerY - 68);

        this.doughTween(this.upDough, this.doughScaleL, this.doughScaleL,
          this.centerX + 150, this.centerY - 75);
      }

      else {
        this.doughTween(this.dough, this.doughScaleL, this.doughScaleL,
          this.centerX + 150, this.centerY - 55);
        this.doughTween(this.downDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 150, this.centerY - 35);
        this.doughTween(this.leftDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 150, this.centerY - 70);
        this.doughTween(this.rightDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 150, this.centerY - 70);

        this.doughTween(this.upDough, this.doughScaleL, this.doughScaleL,
          this.centerX + 150, this.centerY - 75);
      }

      this.upKey.anims.play("upKey", true);
    }

    //roll dough down
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.sound.play("wrong2", {volume: 1, rate: 2});
      if (this.doughScaleL == 0.3 || this.doughScaleS == 0.1) {
        this.doughTween(this.dough, this.doughScaleL, this.doughScaleL,
          this.centerX + 150, this.centerY - 35);
        this.doughTween(this.upDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 150, this.centerY);
        this.doughTween(this.leftDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 150, this.centerY);
        this.doughTween(this.rightDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 150, this.centerY);

        this.doughTween(this.downDough, this.doughScaleL, this.doughScaleL,
          this.centerX + 150, this.centerY - 25);
      }

      else {
        this.doughTween(this.dough, this.doughScaleL, this.doughScaleL,
          this.centerX + 150, this.centerY - 40);
        this.doughTween(this.upDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 150, this.centerY);
        this.doughTween(this.leftDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 150, this.centerY);
        this.doughTween(this.rightDough, this.doughScaleS, this.doughScaleS,
          this.centerX + 150, this.centerY);

        this.doughTween(this.downDough, this.doughScaleL, this.doughScaleL,
          this.centerX + 150, this.centerY - 5);
      }

      this.downKey.anims.play("downKey", true);
    }
  }
  combomake() {
    let combos = [this.randomIntFromInterval(37,40),this.randomIntFromInterval(37,40)];
    //progressing difficulty
    if (this.score > 2800){
      combos.push(this.randomIntFromInterval(37,40));
    }
    if (this.score > 2000){
      combos.push(this.randomIntFromInterval(37,40));
    }
    if (this.score > 1200){
      combos.push(this.randomIntFromInterval(37,40));
    }
    if (this.score > 200){
      combos.push(this.randomIntFromInterval(37,40));
    }
    // create a combos randomly
    let doughcombo = this.shuffle(combos);
    let inputlist = [];
    for (const i of doughcombo) {
      switch(i) {
        case 38:
          inputlist.push('up ');
          break;
        case 40:
          inputlist.push('down ');
          break;
        case 37:
          inputlist.push('left ');
          break;
        case 39:
          inputlist.push('right ');
      }
    }

    let makeIt = this.input.keyboard.createCombo(doughcombo, {
      resetOnWrongKey:true,
      deleteOnMatch: true,
      keyCodes: doughcombo
    });

    // creates comands to be displayed
    let inputtext = '';
    for (const x of inputlist){
      // input list is "up ", "down "
      inputtext = inputtext + x + "\n";
    }
    this.inputPrompt.setText('Press:\n'+ inputtext);
    this.input.keyboard.on('keycombomatch',function(event) {

      this.j = this.j + 1;

      if (this.j == doughcombo.length){
        this.score += (100);
        this.scoreText.setText('Score: '+this.score);
        this.sound.play("wrong2", {volume: 0});
        this.sound.play("correct");
        this.j = 0;

        // go through combo to see if it is the last letter in combo
        for(const x of doughcombo){
            // if (x == 37){
              this.tweens.add({
                targets: this.greenLeftKey,
                alpha: {from: 0, to:1 },
                yoyo:true,
                duration:300
              });
            // }
            // else if (x == 38){
              this.tweens.add({
              targets: this.greenUpKey,
              alpha: {from: 0, to:1 },
              yoyo:true,
              duration:300
            });
          // }
            // else if (x == 39){
            this.tweens.add({
              targets: this.greenRightKey,
              alpha: {from: 0, to:1 },
              yoyo:true,
              duration:300
            });
          // }
            // else if (x == 40){
            this.tweens.add({
              targets: this.greenDownKey,
              alpha: {from: 0, to:1 },
              yoyo:true,
              duration:300
            });
          // }
            //left = 37
            //up = 38
            //right = 39
            //down = 40
            }
          }
      else{
        this.j = 1;
      }
    },this);

  }

  shuffle(a) {
      var j, x, i;
      for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
      }
      return a;
  }

  randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  doughTween(target, scaleX, scaleY, x, y) {
    this.tweens.add({
      targets: target,
      x: x,
      y: y,
      scaleX: scaleX,
      scaleY: scaleY,
      ease: "Quad",
      duration: 400,
      yoyo: true
    });
  }

  arrowButtons() {
    //green arrow frame numbers:
    //upKey: 2
    //leftKey: 5
    //downKey: 8
    //rightKey: 11

    //create up arrow sprite and animation
    this.upKey = this.add.sprite(150, 450, "arrowkeys", 0).setInteractive();
    this.upKey.setScale(0.5);

    // create green keys with alpha = 0
    this.greenUpKey = this.add.sprite(150, 450, "arrowkeys", 2).setInteractive();
    this.greenUpKey.setScale(0.5);
    this.greenUpKey.setAlpha(0);

    this.anims.create({
          key: "upKey",
          frames: this.anims.generateFrameNumbers("arrowkeys", { start: 0, end: 1 }),
          frameRate: 10,
          yoyo: true
        });

    //create left arrow sprite and animation
    this.leftKey = this.add.sprite(50, 550, "arrowkeys", 3).setInteractive();
    this.leftKey.setScale(0.5);

    this.greenLeftKey = this.add.sprite(50, 550, "arrowkeys", 5).setInteractive();
    this.greenLeftKey.setScale(0.5);
    this.greenLeftKey.setAlpha(0);

    this.anims.create({
          key: "leftKey",
          frames: this.anims.generateFrameNumbers("arrowkeys", { start: 3, end: 4 }),
          frameRate: 10,
          yoyo: true
        });

    //create down arrow sprite and animation
    this.downKey = this.add.sprite(150, 550, "arrowkeys", 6).setInteractive();
    this.downKey.setScale(0.5);

    this.greenDownKey = this.add.sprite(150, 550, "arrowkeys", 8).setInteractive();
    this.greenDownKey.setScale(0.5);
    this.greenDownKey.setAlpha(0);

    this.anims.create({
          key: "downKey",
          frames: this.anims.generateFrameNumbers("arrowkeys", { start: 6, end: 7 }),
          frameRate: 10,
          yoyo: true
        });

    //create right arrow sprite and animation
    this.rightKey = this.add.sprite(250, 550, "arrowkeys", 9).setInteractive();
    this.rightKey.setScale(0.5);

    this.greenRightKey = this.add.sprite(250, 550, "arrowkeys", 11).setInteractive();
    this.greenRightKey.setScale(0.5);
    this.greenRightKey.setAlpha(0);

    this.anims.create({
          key: "rightKey",
          frames: this.anims.generateFrameNumbers("arrowkeys", { start: 9, end: 10 }),
          frameRate: 10,
          yoyo: true
        });

  }

  instructions() {
    //create instruction background
    this.textBox = this.add.image(160, 223, "box");
    this.textBox.setScale(0.8, 3);

    //Instructions text
    var title = this.add.text(37, 90,"Instructions", {color:'black',fontFamily: "Skia", fontSize:35,});
    var instructions = this.add.text(35, 135,"- Press the correct arrow", {color:'black',fontFamily: "Skia",fontSize:20,});
    var instructions = this.add.text(53, 155,"keys to roll the dough!", {color:'black',fontFamily: "Skia",fontSize:20,});
    var instructions = this.add.text(35, 195,"- The commands appear in", {color:'black',fontFamily: "Skia",fontSize:20,});
    var instructions = this.add.text(53, 215," order from left to right!", {color:'black',fontFamily: "Skia",fontSize:20,});
    var instructions = this.add.text(35, 255,"- Complete the commands as", {color:'black',fontFamily: "Skia",fontSize:20,});
    var instructions = this.add.text(53, 275,"quick as possible!", {color:'black',fontFamily: "Skia",fontSize:20,});

    var instructions = this.add.text(35, 315,"- Press space to start!", {color:'black',fontFamily: "Skia",fontSize:20,});

  }

  goToNextScene() {
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
        callback: () => this.scene.start("bakeGame",{rollScore: this.score, ingredientScore: this.ingredientScore, mixingScore: this.mixingScore, bakingScore: this.bakingScore, volume:this.volume})
      });
    }, this
  );
  }
}
