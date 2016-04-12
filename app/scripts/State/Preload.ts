module Racing.State {
  export class Preload extends Phaser.State {
    private preloadBar: Phaser.Sprite;

    preload() {
      this.preloadBar = this.add.sprite(0, 148, 'preload-bar');
      this.load.setPreloadSprite(this.preloadBar);

      //this.load.image('menu-background', 'assets/images/menu-background.png');

      // Load remaining assets here
      this.load.tilemap('desert', 'assets/tilemaps/maps/desert.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.image('tiles', 'assets/tilemaps/tiles/tmw_desert_spacing.png');
      this.load.image('car', 'assets/sprites/car90.png');
    }

    create() {
      this.game.state.start('menu');
    }
  }
}
