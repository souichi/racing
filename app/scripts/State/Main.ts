module Racing.State {
  export class Main extends Phaser.State {
    private map: Phaser.Tilemap;
    private layer: Phaser.TilemapLayer;
    private car: Phaser.Sprite;
    private cursors: Phaser.CursorKeys;

    create() {
      this.stage.backgroundColor = 0x000000;

      // Create game objects here
      this.physics.startSystem(Phaser.Physics.ARCADE);
      this.map = this.add.tilemap('desert');
      this.map.addTilesetImage('Desert', 'tiles');
      this.map.setCollisionByExclusion([4,5,6,7,8,12,13,14,15,16,22,23,24,30]);
      this.map.setTileIndexCallback(31, this.hit, this);

      this.layer = this.map.createLayer('Ground');
      this.layer.resizeWorld();
      this.car = this.add.sprite(530, 170, 'car');
      this.car.anchor.setTo(0.5, 0.5);
      this.physics.arcade.enable(this.car);
      this.car.body.collideWorldBounds = true;
      this.camera.follow(this.car);
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
      this.physics.arcade.collide(this.car, this.layer);

      this.car.body.velocity.x = 0;
      this.car.body.velocity.y = 0;
      this.car.body.angularVelocity = 0;

      if (this.cursors.left.isDown) {
        this.car.body.angularVelocity = -200;
      }
      else if (this.cursors.right.isDown) {
        this.car.body.angularVelocity = 200;
      }

      if (this.cursors.up.isDown) {
        this.car.body.velocity.copyFrom(this.physics.arcade.velocityFromAngle(this.car.angle, 300));
      } else if (this.cursors.down.isDown) {
        this.car.body.velocity.copyFrom(this.physics.arcade.velocityFromAngle(this.car.angle, -100));
      }
    }

    render() {
      this.game.debug.spriteInfo(this.car, 10, 10);
    }

    private hit(sprite: Phaser.Sprite, tile: Phaser.Tile) {
      tile.alpha = 0.2;
      this.layer.dirty = true;
      return false;
    }
  }
}
