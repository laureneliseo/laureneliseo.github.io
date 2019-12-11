/*global Phaser*/
export default class finish extends Phaser.Scene {
  constructor () {
    super('finish');
  }
  init(data){
    this.rollScore = data.rollScore;
    this.ingredientScore = data.ingredientScore;
    this.mixingScore = data.mixingScore;
    this.bakingScore = data.bakingScore;
    this.volume = data.volume;
    this.music = data.music;

    //tester
  }

  preload () {
    var test;

    // Preload assets
    this.load.image('backsplash', './assets/images/backsplash.png');
    this.load.image('finish', './assets/images/finish.png');
    this.load.image('finishCake', './assets/images/finish_cake.png');
    this.load.image("counter", "./assets/images/kitch_counter.png");
    this.load.spritesheet("menuBut", "./assets/spriteSheets/menu_button.png", {
      frameWidth: 426,
      frameHeight: 183
    });

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

  }

  create (data) {
    const backsplash = this.add.sprite(800 / 2, 351, 'backsplash');
    //default to croissant mode
    this.order = this.add.sprite(this.centerX - 6, this.centerY + 15, 'finish');
    this.order.setScale(0.9);

    //play music
    var menuMusic = this.sound.add('menuMusic');
    menuMusic.play({ loop: true, volume: this.volume });﻿

    var scores1 = this.add.text(330, 365,"Ingredients: " + this.ingredientScore, {color:'black',fontFamily: "Skia", fontSize:20,});
    var scores2 = this.add.text(330, 385,"Stirring:    " + this.mixingScore, {color:'black',fontFamily: "Skia", fontSize:20,});
    var scores3 = this.add.text(330, 405,"Rolling:     " + this.rollScore, {color:'black', fontFamily: "Skia", fontSize:20,});
    var scores4 = this.add.text(330, 425,"Baking:      " + this.bakingScore, {color:'black',fontFamily: "Skia",fontSize:20,});

    if (this.registry.get('type')=='cake'){
      //set cake order up screen
      this.order.setTexture("finishCake");
      //cake mode skips rolling score
      this.grade = (this.ingredientScore/ 1000 + this.mixingScore/900 + this.bakingScore/2800) / 3;
      scores3.setVisible(false);
      scores4.y = 405;
    }
    else{
      //croissant mode includes everything
      this.grade = (this.ingredientScore/ 1200 + this.rollScore/1500 + this.mixingScore/900 + this.bakingScore/3200) / 4;
    }

    if (this.grade >= 0.90) {
      var gradeText = this.add.text(this.centerX + 40, 460, "A", {color:'black',fontFamily: "Skia",fontSize:30,});
    }
    else if (this.grade >= 0.80) {
      var gradeText = this.add.text(this.centerX + 40, 460, "B", {color:'black',fontFamily: "Skia",fontSize:30,});
    }
    else if (this.grade >= 0.70) {
      var gradeText = this.add.text(this.centerX + 40, 460, "C", {color:'black',fontFamily: "Skia",fontSize:30,});
    }
    else {
      var gradeText = this.add.text(this.centerX + 40, 460, "F", {color:'black',fontFamily: "Skia",fontSize:30,});
    }

    //menu button
    this.menu = this.add.sprite(650, 500, "menuBut", 0).setScale(0.4).setInteractive();
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
        callback: () => this.scene.start("menu", {music: menuMusic.stop(), volume: this.volume, rollScore: 0, ingredientScore :0, mixingScore :0, bakingScore :0})
      });
    }, this
  );
  }

}
