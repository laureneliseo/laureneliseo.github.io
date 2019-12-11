export { debugButtons };
/*------------------------
!!!HOW TO USE!!!
>Paste this code into the top of your scene:
import * as debugging from "../prefabs/debugButtons.js";

>Paste this code wherever you want to put the debug buttons:
//add debugButtons scene event listeners
debugging.debugButtons(this, [startOn], [menuOn], [ingOn], [stirOn], [rollOn], [bakeOn]);

                  >the variables in brackets are bools
                  >change to true when you want to display a button

>NOTE: you may have to change the x position of a button in order to see/use it
>do this after calling the function above by referencing the x property of the button sprite
>ie "iAmAssignedToAGlobalVariable.stirring.x = 140"

-----------------------*/

function debugButtons(that, startOn, menuOn, ingOn, stirOn, rollOn, bakeOn) {
  //init
  //booleans that check which buttons you want enabled
  that.startOn = startOn;
  that.menuOn = menuOn;
  that.ingOn = ingOn;
  that.stirOn = stirOn;
  that.rollOn = rollOn;
  that.bakeOn = bakeOn;

  //preload
  that.load.spritesheet("start", "./assets/spriteSheets/start_button.png", {
    frameWidth: 426,
    frameHeight: 183
  });
  that.load.spritesheet("menuBut", "./assets/spriteSheets/menu_button.png", {
    frameWidth: 426,
    frameHeight: 183
  });
  that.load.spritesheet("ingredients", "./assets/spriteSheets/ing_button.png", {
    frameWidth: 426,
    frameHeight: 181
  });
  that.load.spritesheet("stirring", "./assets/spriteSheets/stir_button.png", {
    frameWidth: 426,
    frameHeight: 181
  });
  that.load.spritesheet("rolling", "./assets/spriteSheets/roll_button.png", {
    frameWidth: 426,
    frameHeight: 181
  });
  that.load.spritesheet("baking", "./assets/spriteSheets/bake_button.png", {
    frameWidth: 426,
    frameHeight: 183
  });

  //add buttons to the scene
  //start button
  if (that.startOn == true) {

    that.start = that.add.sprite(50, 25, "start", 0).setScale(0.2).setInteractive();
    that.start.on("pointerover", function () {
      this.setFrame(1);
    });
    that.start.on("pointerout", function() {
      this.setFrame(0);
    });
    that.start.on("pointerup", function() {
      this.start.setFrame(2);
      that.time.addEvent({
        delay: 100,
        callback: () => that.scene.start("menu")
      });
    }, that
  );

  }

  //menu button
  if (that.menuOn == true) {

    that.menu = that.add.sprite(50, 25, "menuBut", 0).setScale(0.2).setInteractive();
    that.menu.on("pointerover", function () {
      this.setFrame(1);
    });
    that.menu.on("pointerout", function() {
      this.setFrame(0);
    });
    that.menu.on("pointerup", function() {
      this.menu.setFrame(2);
      that.time.addEvent({
        delay: 100,
        callback: () => that.scene.start("menu", {music: this.music.stop(), volume: this.volume, rollScore: 0, ingredientScore :0, mixingScore :0, bakingScore :0})
      });
    }, that
  );

  }

  //ingredients
  if (that.ingOn == true) {

    that.ingredients = that.add.sprite(140, 25, "ingredients", 0).setScale(0.2).setInteractive();
    that.ingredients.on("pointerover", function () {
      this.setFrame(1);
    });
    that.ingredients.on("pointerout", function() {
      this.setFrame(0);
    });
    that.ingredients.on("pointerup", function() {
      this.ingredients.setFrame(2);
      that.time.addEvent({
        delay: 100,
        callback: () => that.scene.start("ingredientbeta", {rollScore: this.rollScore, ingredientScore: this.ingredientScore, mixingScore: this.stirScore})
      });
    }, that
  );

  }

  //stirring
  if (that.stirOn == true) {

    that.stirring = that.add.sprite(230, 25, "stirring", 0).setScale(0.2).setInteractive();
    that.stirring.on("pointerover", function () {
      this.setFrame(1);
    });
    that.stirring.on("pointerout", function() {
      this.setFrame(0);
    });
    that.stirring.on("pointerup", function() {
      this.stirring.setFrame(2);
      that.time.addEvent({
        delay: 100,
        callback: () => that.scene.start("mixing", {rollScore: this.rollScore, ingredientScore: this.ingredientScore, mixingScore: this.stirScore})
      });
    }, that
  );

  }

  //rolling
  if (that.rollOn == true) {

    that.rolling = that.add.sprite(230, 25, "rolling", 0).setScale(0.2).setInteractive();
    that.rolling.on("pointerover", function () {
      this.setFrame(1);
    });
    that.rolling.on("pointerout", function() {
      this.setFrame(0);
    });
    that.rolling.on("pointerup", function() {
      this.rolling.setFrame(2);
      that.time.addEvent({
        delay: 100,
        callback: () => that.scene.start("roll", {rollScore: this.rollScore, ingredientScore: this.ingredientScore, mixingScore: this.stirScore})
      });
    }, that
  );

  }

  //baking
  if (that.bakeOn == true) {

    that.baking = that.add.sprite(320, 25, "baking", 0).setScale(0.2).setInteractive();
    that.baking.on("pointerover", function () {
      this.setFrame(1);
    });
    that.baking.on("pointerout", function() {
      this.setFrame(0);
    });
    that.baking.on("pointerup", function() {
      this.baking.setFrame(2);
      that.time.addEvent({
        delay: 100,
        callback: () => that.scene.start("bakeGame", {rollScore: this.rollScore, ingredientScore: this.ingredientScore, mixingScore: this.stirScore})
      });
    }, that
  );

  }
}
