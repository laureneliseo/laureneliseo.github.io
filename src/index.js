/*global Phaser, window*/
import menu from './scenes/menu.js';
import mixingScene from './scenes/mixingScene.js';
import Roll from './scenes/roll.js';
import Config from './config/config.js';
import IngredientBeta from './scenes/ingredientbeta.js';
import finish from './scenes/finish.js';
import bakeGame from './scenes/bakeGame.js';
import options from './scenes/options.js';


class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('menu', menu );
    this.scene.add('roll', Roll);
    this.scene.add('finish', finish);
    this.scene.add('mixing', mixingScene);
    this.scene.add('ingredientbeta', IngredientBeta);
    this.scene.add('bakeGame',bakeGame);
    this.scene.add('options',options);
    this.scene.start('menu');
  }
}

window.game = new Game();
