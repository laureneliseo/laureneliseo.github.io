export default class options extends Phaser.Scene {
  constructor () {
    super('options');
  }
  init(data){
    this.rollScore = data.rollScore;
    this.ingredientScore = data.ingredientScore;
    this.mixingScore = data.mixingScore;
    this.bakingScore = data.bakingScore;
    this.volume = data.volume;
    this.returnScene = data.returnScene;
  }

  preload() {
    // Preload assets
    this.load.image('backsplash', './assets/images/backsplash.png');
    this.load.image('options_menu', './assets/images/options_v3.png');
    this.load.image("counter", "./assets/images/kitch_counter.png");
    this.load.audio('menuMusic', './assets/music/Magic Scout - Farm.mp3');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

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

    this.load.spritesheet("back", "./assets/spriteSheets/back_button.png", {
      frameWidth: 426,
      frameHeight: 183
    });

    //SLIDER
    this.load.scenePlugin({
        key: 'rexuiplugin',
        url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js',
        sceneKey: 'rexUI'
    });

  }

  create (data) {
    //create background and options menu background
    const backsplash = this.add.sprite(800 / 2, 351, 'backsplash');
    this.option = this.add.sprite(this.centerX + 10, this.centerY + 19.5, 'options_menu');
    this.option.setScale(0.9);
    this.credits();

    var mainPanel = this.createMainPanel(this)
        .setPosition(425, 275)
        .layout();

    //add debugButtons scene event listeners
    // debugging.debugButtons(this, false, true, true, true, true, true);
    // this.rolling.x = 320;
    // this.baking.x = 410;

    //Return BUTTON
    this.options = this.add.sprite(400, 520, "back", 0).setScale(0.4).setInteractive();
    this.options.on("pointerover", function () {
      this.setFrame(1);
    });
    this.options.on("pointerout", function() {
      this.setFrame(0);
    });
    this.options.on("pointerup", function() {
      this.options.setFrame(2);
      this.menuMusic.stop();
      this.time.addEvent({
        delay: 100,
        callback: () => {
          if(this.returnScene == 0){
            this.scene.start('menu', {rollScore: this.rollScore, ingredientScore: this.ingredientScore,
                mixingScore: this.mixingScore, bakingScore:this.bakingScore, volume: this.volume});}
          if(this.returnScene == 1){
            this.scene.start('ingredientbeta', {rollScore: this.rollScore, ingredientScore: this.ingredientScore,
                mixingScore: this.mixingScore, bakingScore:this.bakingScore, volume: this.volume});}
          if(this.returnScene == 2){
              this.scene.start('mixing', {rollScore: this.rollScore, ingredientScore: this.ingredientScore,
              mixingScore: this.mixingScore, bakingScore:this.bakingScore, volume: this.volume});}
          if(this.returnScene == 3){
            this.scene.start('roll', {rollScore: this.rollScore, ingredientScore: this.ingredientScore,
                mixingScore: this.mixingScore, bakingScore:this.bakingScore, volume: this.volume});}
          if(this.returnScene == 4){
            this.scene.start('bakeGame', {rollScore: this.rollScore, ingredientScore: this.ingredientScore,
                mixingScore: this.mixingScore, bakingScore:this.bakingScore, volume: this.volume});}
        }

      });
    }, this
    );

  }

  update() {

  }

  credits() {
    this.add.text(this.centerX - 120, this.centerY - 50,
      "Programming",
      {color: "black", fontSize: 20, fontFamily: "Skia", fontStyle: "bold"}
    );
    this.add.text(this.centerX - 121, this.centerY - 25,
      "Lauren O'Connor",
      {color: "black", fontSize: 18, fontFamily: "Skia"}
    );
    this.add.text(this.centerX - 107, this.centerY,
      "David Phung",
      {color: "black", fontSize: 18, fontFamily: "Skia"}
    );
    this.add.text(this.centerX - 118, this.centerY + 25,
      "Olivia Schweers",
      {color: "black", fontSize: 18, fontFamily: "Skia"}
    );
    this.add.text(this.centerX + 80, this.centerY - 50,
      "Sound",
      {color: "black", fontSize: 20, fontFamily: "Skia", fontStyle: "bold"}
    );
    this.add.text(this.centerX + 46, this.centerY - 25,
      "Lauren O'Connor",
      {color: "black", fontSize: 18, fontFamily: "Skia"}
    );
    this.add.text(this.centerX + 260, this.centerY - 50,
      "Art",
      {color: "black", fontSize: 20, fontFamily: "Skia", fontStyle: "bold"}
    );
    this.add.text(this.centerX + 215, this.centerY - 25,
      "Olivia Schweers",
      {color: "black", fontSize: 18, fontFamily: "Skia"}
    );
    this.add.text(this.centerX - 130, this.centerY + 70,
      "Additional Assets",
      {color: "black", fontSize: 20, fontFamily: "Skia", fontStyle: "bold"}
    );
    this.add.text(this.centerX - 130, this.centerY + 120,
      "Magic Scout Farm | Onion Capers – Kevin MacLeod",
      {color: "black", fontSize: 18, fontFamily: "Skia"}
    );
    this.add.text(this.centerX - 130, this.centerY + 95,
      "Cake | Croissant – Icons8 ",
      {color: "black", fontSize: 18, fontFamily: "Skia"}
    );
    this.add.text(this.centerX + 110, this.centerY + 95,
      "Catch | Dough – Freesound",
      {color: "black", fontSize: 18, fontFamily: "Skia"}
    );
    this.add.text(this.centerX - 129, this.centerY + 145,
      "Volume Slider – RexUI",
      {color: "black", fontSize: 18, fontFamily: "Skia"}
    );
  }

  createController(scene) {
    // Create components
    var slider = this.createSlider(scene, 'Volume', 0x6e46b3, 0xb194e3, 0x3f2f5c).setName('Volume');
    var controlPanel = scene.rexUI.add.sizer({
            orientation: 'y',
        })
        .add(
            slider, //child
            0, // proportion
            'center', // align
            0, // paddingConfig
            true // expand
        );

    // Connect events
    slider.on('valuechange', function () {
        this.emit('valuechange');
    }, controlPanel);
    return controlPanel;
  }

  createMainPanel(scene) {
    //play music
    var menuMusic;
    this.menuMusic = this.sound.add('menuMusic');
    this.menuMusic.play({ loop: true, volume: this.volume });﻿

    // Create components
    var objectPanel = scene.add.rectangle(0, 0, 100, 200);
    var controller = this.createController(scene);
    var mainPanel = scene.rexUI.add.sizer({
            orientation: 'x',
        }).add(
            controller, //child
            0, // proportion
            'top', // align
            0, // paddingConfig
            false // expand
        )
        .add(
            objectPanel, //child
            0, // proportion
            'center', // align
            0, // paddingConfig
            false // expand
        );

    // Connect events
    var updateVolume = function () {
        var red = Math.round(controller.getByName('Volume').getValue(0, 255));
        };
    var updateVolume = function (music) {
        scene.load.audio('menuMusic', './assets/music/Magic Scout - Farm.mp3');

        scene.volume = Math.round(controller.getByName('Volume').getValue(0, 255))/255;
        scene.menuMusic.play({ loop: true, volume:(scene.volume) });﻿

    };
    controller.on('valuechange', function () {
        updateVolume();

    });
    //updateVolume();
    return mainPanel;
  }

  createSlider(scene, colorText, colorPrimary, colorDark, colorLight) {
    return scene.rexUI.add.numberBar({
        background: scene.rexUI.add.roundRectangle(10, 0, 0, 0, 0, colorDark),
        icon: scene.add.text(0, 0, colorText, {
            fontSize: 18,
            fontFamily: "Skia"
        }),

        slider: {
            track: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, colorPrimary),
            indicator: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, colorLight),
            input: 'click',
            width: 100, // Fixed width
        },

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,

            icon: 10,
            slider: 10,
        },

        value: this.volume
    });
  }
}
