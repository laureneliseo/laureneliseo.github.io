/*global Phaser*/
import * as debugging from "../prefabs/debugButtons.js";

export default class ingredientbeta extends Phaser.Scene {
  constructor () {
    super('ingredientbeta');
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
    this.load.image('bowl','./assets/images/bowl.png');
    this.load.image('stirBowl','./assets/images/bowl_stir.png');
    this.load.image('halfBowl','./assets/images/bowl_half.png');
    this.load.image('quarterBowl','./assets/images/bowl_quarter.png');
    this.load.image('eggs','./assets/images/eggs.png');
    this.load.image('flour','./assets/images/flour.png');
    this.load.image('sugar','./assets/images/sugar.png');
    this.load.image("backsplash", "./assets/images/backsplash.png");
    this.load.image("counter", "./assets/images/kitch_counter.png");
    this.load.audio('music', './assets/music/Onion Capers.mp3');
    this.load.audio('catch', './assets/sounds/ingBowl.wav');
    this.load.spritesheet("menuScreen", "./assets/spriteSheets/menu_button.png", {
      frameWidth: 426,
      frameHeight: 183
    });
    this.load.spritesheet("ingredients", "./assets/spriteSheets/ing_button.png", {
      frameWidth: 426,
      frameHeight: 181
    });
    this.load.spritesheet("stirring", "./assets/spriteSheets/stir_button.png", {
      frameWidth: 426,
      frameHeight: 181
    });
    this.load.spritesheet("rolling", "./assets/spriteSheets/roll_button.png", {
      frameWidth: 426,
      frameHeight: 181
    });
    this.load.spritesheet("baking", "./assets/spriteSheets/bake_button.png", {
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

    this.timer = 15;
    this.score = 0;

    this.load.audio('ingMusic',['assets/music/Onion Capers.mp3']);

    this.load.image("box", "./assets/images/whatyouremaking.png");
  }

  create (data) {

    //play music
    this.music = this.sound.add('music');
    this.music.play({ loop: true, volume: this.volume});﻿

    //Create the scene
    const background = this.add.sprite(this.centerX, this.centerY, "backsplash");
    var counter = this.add.sprite(this.centerX, 600, "counter");
    this.load.image("counter", "./assets/images/kitch_counter.png");
    background.setDepth(0);

    //add debugButtons scene event listeners
    debugging.debugButtons(this, false, true, false, false, false, false);
    //this.stirring.x = 140;

    this.timerText = this.add.text(560,40,'Time: '+ this.timer,
      {color:'black',fontSize:30, fontFamily: "Skia"});
    this.scoreText = this.add.text(560,80,'Score: '+ this.score,
      {color:'black',fontSize:30, fontFamily: "Skia"});
    this.timerText.setDepth(100);
    this.scoreText.setDepth(100);
    this.textBox = this.add.image(280, 150, "box");
    this.textBox.setScale(1.5);
    this.instructions = this.add.text(50,100,
      "Catch the ingredients by controlling the bowl\nwith the arrow keys!"+
      '\n\nPress Space to start!',
      {color:'black', fontFamily: "Skia", fontSize:24});

    //set input
    this.startButton =
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.cursors = this.input.keyboard.createCursorKeys();
    //add bowl and make it controllable
    this.physics.world.setBoundsCollision();
    this.bowl = this.physics.add.sprite(this.centerX, 550,'bowl');
    this.bowl.setScale(0.2);
    this.bowl.body.setCollideWorldBounds();
    //add ingredient drops
    this.eggs = this.physics.add.group ({
      defaultKey: 'eggs',
      maxSize: 10,
    });

    this.flour = this.physics.add.group({
      defaultKey:'flour',
      maxSize: 10,
    });

    this.sugar = this.physics.add.group({
      defaultKey:'sugar',
      maxSize: 10,
    });
    //confirm transition button
    this.moveButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.moveButton.enabled = false;

    //Add text to prompt player to change scenes
    // this.nextScene = this.add.text(this.centerX + 1000, this.centerY + 750,
    // "Press to go to next stage ->", {
    //   fontSize: 16,
    //   color: "black",
    //   fontFamily:'Skia'
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
        callback: () => this.scene.start('options', {rollScore: this.rollScore, ingredientScore: this.score,
           mixingScore: this.mixingScore, bakingScore:this.bakingScore, volume: this.volume, returnScene: 1})
      });
    }, this
  );

  }

  update (time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.moveButton)) {
      this.music.stop();
      this.scene.start('mixing',{rollScore: this.rollScore, ingredientScore: this.score,
         mixingScore: this.mixingScore, bakingScore:this.bakingScore, volume: this.volume});
    }
    // Update the scene
    const speed = 900;

    this.bowl.body.setAcceleration(0);
    this.bowl.body.setDrag(speed+speed);
    //bowl slides with left/right keys
    if (this.cursors.left.isDown) {
      this.bowl.body.setAccelerationX(-speed);
    }
    if (this.cursors.right.isDown) {
      this.bowl.body.setAccelerationX(speed);
    }
    // add collision detection for ingredients and disable and reduce score
    //if they leave screen
    this.eggs.children.each(
      function(child) {
        if (child.active){
          this.physics.add.overlap(
            child,
            this.bowl,
            this.collect,
            null,
            this
          );
          if (child.y > this.cameras.main.height) {
            child.setActive(false);
            this.score -= 50;
            this.scoreText.setText('Score: '+this.score);
            this.bowlTexture();
          }
        }
      }.bind(this)
    );

    this.flour.children.each(
      function(child) {
        if (child.active){
          this.physics.add.overlap(
            child,
            this.bowl,
            this.collect,
            null,
            this
          );
          if (child.y > this.cameras.main.height) {
            child.setActive(false);
            this.score -= 50;
            this.scoreText.setText('Score: '+this.score);
            this.bowlTexture();
          }
        }
      }.bind(this)
    );

    this.sugar.children.each(
      function(child) {
        if (child.active){
          this.physics.add.overlap(
            child,
            this.bowl,
            this.collect,
            null,
            this
          );
          if (child.y > this.cameras.main.height) {
            child.setActive(false);
            this.score -= 50;
            this.scoreText.setText('Score: '+this.score);
            this.bowlTexture();
          }
        }
      }.bind(this)
    );

    //begin game
    if (Phaser.Input.Keyboard.JustDown(this.startButton)) {
      if (this.timer <= 0){
      }
      else {
        //timer, instructions go away and start button is disabled
        this.startButton.enabled = false;
        this.textBox.destroy();
        this.instructions.setText('');
        //spawn drop immediately at start
        var eggs = this.eggs.get();
        eggs.setDepth(10);
        eggs.setScale(0.3);
        eggs.enableBody(true,90,this.randomIntFromInterval(100,200),
          true,true);
        eggs.body.setVelocity(this.randomIntFromInterval(120,180),-100);
        eggs.body.setGravityY(100);
        var flour = this.flour.get();
        flour.setDepth(10);
        flour.setScale(0.25);
        flour.enableBody(true,750,this.randomIntFromInterval(100,300),
          true,true);
        flour.body.setVelocity(this.randomIntFromInterval(-80,-120),-100);
        flour.body.setGravityY(100);
        this.timePrompt = this.time.addEvent({
          delay:1000,
          callback: function(){
            this.timer --;
            this.timerText.setText('Time: ' +this.timer);
            //when time runs out stop everything
            if (this.timer <= 0){
              this.timePrompt.remove();
              this.eggEvent.remove();
              this.flourEvent.remove();
              this.sugarEvent.remove();
              this.eggs.clear(true,true);
              this.flour.clear(true,true);
              this.sugar.clear(true,true);

              //text to show scene is about to change
              this.transition();

            }
          },
          callbackScope: this,
          loop:true
        });
        //add timed drops for each ingredient
        this.eggEvent = this.time.addEvent({
          delay: 5300,
          callback:function(){
            var eggs = this.eggs.get();
            eggs.setDepth(10);
            eggs.setScale(0.3);
            eggs.enableBody(true,90,this.randomIntFromInterval(100,200),
              true,true);
            eggs.body.setVelocity(this.randomIntFromInterval(120,180),-100);
            eggs.body.setGravityY(100);
          },
          callbackScope:this,
          loop:true,
        });
        this.flourEvent = this.time.addEvent({
          delay: 4000,
          callback:function(){
            var flour = this.flour.get();
            flour.setDepth(10);
            flour.setScale(0.25);
            flour.enableBody(true,750,this.randomIntFromInterval(100,300),
              true,true);
            flour.body.setVelocity(this.randomIntFromInterval(-80,-120),-100);
            flour.body.setGravityY(100);
          },
          callbackScope:this,
          loop:true,
        });
        this.sugarEvent = this.time.addEvent({
          delay: 3000,
          callback:function(){
            var sugar = this.sugar.get();
            sugar.setDepth(10);
            sugar.setScale(0.22);
            sugar.setGravityY(30);
            sugar.enableBody(true,80,this.randomIntFromInterval(100,250),
              true,true);
            sugar.body.setVelocity(this.randomIntFromInterval(25,100),-110);
            sugar.body.setGravityY(100);
          },
          callbackScope:this,
          loop:true,
        });

      }
    }
}
  //collider that disables ingredient body and adds score
  collect(ingredient, bowl) {
    this.sound.play('catch', {rate: this.randomIntFromInterval(0.5, 2)});
    ingredient.disableBody(true,true);
    this.score += 100;
    this.scoreText.setText('Score: '+this.score);
    this.bowlTexture();
    this.bowlTween = this.tweens.add({
      targets: this.bowl,
      y: this.bowl.y + 5,
      ease: "Bounce",
      duration: 100,
      yoyo: true,
    });
  }

  bowlTexture() {
    if (this.score >= 150) {
      this.bowl.setTexture('quarterBowl');
    }
    if (this.score >= 400) {
      this.bowl.setTexture('halfBowl');
    }
    if (this.score >= 600) {
      this.bowl.setTexture('stirBowl');
    }
  }

  transition(){
    this.tweens.add({
      targets: this.nextScene,
      x: 470,
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

  randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
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
        callback: () => this.scene.start("mixing",{rollScore: this.rollScore, ingredientScore: this.score, mixingScore: this.mixingScore, volume: this.volume, bakingScore: this.bakingScore})
      });
    }, this
  );
  }
}
