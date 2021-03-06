module Racing.State {
  export class Boot extends Phaser.State {
    preload() {
      this.load.image('preload-bar', 'assets/images/preload-bar.png');
    }

    create() {
      this.game.stage.backgroundColor = 0xFFFFFF;

      // Assign global settings here
      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.state.start('preload');
    }
  }
}
