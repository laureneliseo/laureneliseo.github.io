/*global Phaser*/
import Config from '../config/config.js';

export default class menu extends Phaser.Scene {
  constructor () {
    super('menu');
  }

  init(data){
    if (data != undefined){
      this.rollScore = data.rollScore;
      this.ingredientScore = data.ingredientScore;
      this.mixingScore = data.mixingScore;
      this.bakingScore = data.bakingScore;
      this.volume = data.volume;
      this.music = data.music;
    }
    else{
      this.rollScore = 0;
      this.ingredientScore = 0;
      this.mixingScore = 0;
      this.bakingScore = 0;
      this.volume = 1;
    }
  }

  preload () {

    // Preload assets
    // croissant - https://www.stickers-factory.com/stickers/various-categories-1/food-drink/croissant-cartoon-22326.html
    // robot - https://www.trzcacak.rs/imgm/iRRJxwT_cartoon-robot-clipart-robot-clipart/
    //croissant – https://icons8.com/icons/set/croissant
    //cake – https://icons8.com/icons/set/cake
    //crêpe – https://www.clipartmax.com/middle/m2i8A0d3A0m2N4H7_crepe-free-icon-crepe-icon/
    this.load.image('backsplash', './assets/images/backsplash.png');
    this.load.image('menu_background', './assets/images/menu_v3.png');
    this.load.image("cakeMode", "./assets/images/cake_button.png");
    this.load.image("croisMode", "./assets/images/crois_button.png");
    this.load.image("deselect", "./assets/images/no_button.png");
    this.load.audio('menuMusic', './assets/music/Magic Scout - Farm.mp3');

    this.load.spritesheet("start", "./assets/spriteSheets/start_button.png", {
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
    this.load.spritesheet("menuBut", "./assets/spriteSheets/menu_button.png", {
      frameWidth: 426,
      frameHeight: 183
    });


    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    // Set up decision
    //use this boolean to determine which game mode to load
    if (this.registry.get("type") == "cake") {
      var isCake = true;
    }
    else {
      var type = this.registry.set('type', 'croissant');
      var isCake = false;
    }

    this.add.sprite(800 /2 , 351, "backsplash");
    const background = this.add.sprite(this.centerX - 6, this.centerY + 15, 'menu_background');
    background.setScale(0.9);

    this.sound.add('menuMusic');
    this.music = this.sound.add('menuMusic');
    this.music.play({ loop: true, volume: this.volume});﻿
    this.menuAudio = Config.audio.disableWebAudio;
    this.menuAudio = false;

    //game mode text
    var difficulty = this.add.text(40, 500, "Croissanteur!", {color: "#8E668D", fontSize: 36, fontFamily: "SignPainter"});

    //add buttons to the scene
    //cake button/cake mode is chosen if iscake is true
    if (isCake) {
      var cakeMode = this.add.sprite(this.centerX + 264, this.centerY + 112, "cakeMode").setScale(-0.9, 0.9).setInteractive();
      difficulty.text = "Piece of Cake";
    }
    if (!isCake) {
      var cakeMode = this.add.sprite(this.centerX + 264, this.centerY + 112, "deselect").setScale(-0.9, 0.9).setInteractive();
      difficulty.text = "Croissanteur!";
    }
    cakeMode.on("pointerover", function () {
      cakeMode.setTexture("cakeMode");
    });
    cakeMode.on("pointerout", function () {
      if (!isCake) {
        //cake is not already selected, turn off cake button on mouse exit
        cakeMode.setTexture("deselect");
      }
    });
    cakeMode.on("pointerup", function () {
      if (!isCake) {
        //cake is not already selected, switch button to cake
        cakeMode.setTexture("cakeMode");
        croisMode.setTexture("deselect");

        //change isCake to true and set up decision to cake mode
        isCake = true;
        //change game mode text
        difficulty.text = "Piece of Cake";

        this.time.addEvent({
          callback: () => this.registry.set("type", "cake")
        });
      }
    }, this);
    //croissant mode/button is selected if cake mode is false
    if (isCake) {
      var croisMode = this.add.sprite(this.centerX + 264, this.centerY - 19, "deselect").setScale(-0.9, 0.9).setInteractive();
      difficulty.text = "Piece of Cake";
    }
    if (!isCake) {
      var croisMode = this.add.sprite(this.centerX + 264, this.centerY - 19, "croisMode").setScale(-0.9, 0.9).setInteractive();
      difficulty.text = "Croissanteur!";
    }
    croisMode.on("pointerover", function () {
      croisMode.setTexture("croisMode");
    });
    croisMode.on("pointerout", function () {
      if (isCake) {
        //cake is already selected, turn off crois button on mouse exit
        croisMode.setTexture("deselect");
      }
    });
    croisMode.on("pointerup", function () {
      if (isCake) {
        //cake is already selected, switch button to croissant
        croisMode.setTexture("croisMode");
        cakeMode.setTexture("deselect");
        //change isCake to false and set up decision to croissant mode
        isCake = false;
        //change game mode text
        difficulty.text = "Croissanteur!";

        this.time.addEvent({
          callback: () => this.registry.set("type", "croissant")
        });
      }
    }, this);

    var start = this.add.sprite(130, 270, "start", 0).setScale(0.4).setInteractive();
    start.on("pointerover", function () {
      this.setFrame(1);
    });
    start.on("pointerout", function() {
      this.setFrame(0);
    });
    start.on("pointerup", function() {
      start.setFrame(2);
      this.music.stop();
      this.time.addEvent({
        delay: 100,
        callback: () => this.scene.start("ingredientbeta", {rollScore: this.rollScore, ingredientScore: this.ingredientScore, mixingScore: this.mixingScore, volume: this.volume, bakingScore: this.bakingScore})
      });
    }, this
  );


    var easy = this.add.text(647, 445, "Easy", {color: "purple", fontSize: 15, fontFamily: "Skia"});
    var hard = this.add.text(645, 317, "Hard", {color: "purple", fontSize: 15, fontFamily: "Skia"});

    var options = this.add.sprite(130, 350, "options", 0).setScale(0.4).setInteractive();
    options.on("pointerover", function () {
      this.setFrame(1);
    });
    options.on("pointerout", function() {
      this.setFrame(0);
    });
    options.on("pointerup", function() {
      this.music.stop();
      options.setFrame(2);
      this.time.addEvent({
        delay: 100,
        callback: () => this.scene.start("options", {rollScore: this.rollScore,
          ingredientScore: this.ingredientScore, mixingScore: this.mixingScore,
          volume: this.volume, bakingScore: this.bakingScore, returnScene: 0})
      });
    }, this
  );

  }
}
