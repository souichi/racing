/// <reference path="../typings/milkcocoa.d.ts"/>
/// <reference path="../Dto.ts" />

module Racing.State {
  class Car extends Phaser.Sprite {
    public id: number;
    constructor(id: number, game: Phaser.Game, x: number, y: number){
      super(game, x, y, 'car');
      this.id = id;
    }
  }

  export class Main extends Phaser.State {
    private map: Phaser.Tilemap;
    private layer: Phaser.TilemapLayer;
    private myCar: Phaser.Sprite;
    private cars: Phaser.Sprite[];
    private cursors: Phaser.CursorKeys;
    private speed: number;
    private roomDs: milkcocoa.DataStore<Dto.Room>;
    private carDs: milkcocoa.DataStore<Dto.Car>;

    private myRoomId: number;
    private myCarId :number;

    preload() {
       var milkcocoa = new MilkCocoa('readin2hef9q.mlkcca.com');
       this.roomDs = milkcocoa.dataStore("room");
       this.carDs = milkcocoa.dataStore("car");
    }

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
      this.myCar = this.add.sprite(530, 170, 'car');
      this.myCar.anchor.setTo(0.5, 0.5);
      this.physics.arcade.enable(this.myCar);
      this.myCar.body.collideWorldBounds = true;
      this.camera.follow(this.myCar);
      this.cursors = this.input.keyboard.createCursorKeys();
      this.speed = 300;

      this.roomDs.get(this.myRoomId.toString(), (error, data) => {
        this.cars = new Array<Phaser.Sprite>();
        for (let i = 0; i < data.value.cars.length; i++) {
          var carId = data.value.cars[i];
          if (carId == this.myCarId)
            continue;
          var car = this.add.sprite(530, 170, 'car');
          (<any>car).id = carId;  // TODO:
          car.anchor.setTo(0.5, 0.5);
          this.cars.push(car);
        }
      });

      this.carDs.on('set', data => {
        for (let i = 0; i < this.cars.length; i++) {
          var car = this.cars[i];
          if ((<any>car).id.toString() != data.id)  // TODO:
              continue;
          car.rotation = data.value.rotation;
          car.position.x = data.value.x;
          car.position.y = data.value.y;
        }
      });

      setInterval(() => {
        this.carDs.get(this.myCarId.toString(), (error, data) => {
          if (error ||
            data.value.x != this.myCar.position.x ||
            data.value.y != this.myCar.position.y ||
            data.value.rotation != this.myCar.rotation) {
              this.carDs.set(this.myCarId.toString(), {
                x: this.myCar.position.x,
                y: this.myCar.position.y,
                rotation: this.myCar.rotation,
              });
            }
          });
        }, 100);
    }

    update() {
      this.physics.arcade.collide(this.myCar, this.layer);

      this.myCar.body.velocity.x = 0;
      this.myCar.body.velocity.y = 0;
      this.myCar.body.angularVelocity = 0;

      if (this.cursors.left.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        this.myCar.body.angularVelocity = -200;
      }
      else if (this.cursors.right.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        this.myCar.body.angularVelocity = 200;
      }

      if (this.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        this.myCar.body.velocity.copyFrom(this.physics.arcade.velocityFromAngle(this.myCar.angle, this.speed));
      } else if (this.cursors.down.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
        this.myCar.body.velocity.copyFrom(this.physics.arcade.velocityFromAngle(this.myCar.angle, -100));
      }
    }

    render() {
      // this.game.debug.spriteInfo(this.myCar, 10, 10);
    }

    setMyCarId(carId: number) {
      this.myCarId = carId;
    }

    setMyRoomId(roomId: number) {
      this.myRoomId = roomId;
    }

    private hit(sprite: Phaser.Sprite, tile: Phaser.Tile) {
      this.speed = 500;
      setTimeout(() =>{
        this.speed = 300;
      }, 500);
      tile.alpha = 0.2;
      this.layer.dirty = true;
      return false;
    }
  }
}
