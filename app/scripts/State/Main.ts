/// <reference path="../typings/milkcocoa.d.ts"/>
/// <reference path="../Dto.ts" />

module Racing.State {
  export class Main extends Phaser.State {
    static LAP = 3;
    private map: Phaser.Tilemap;
    private layer: Phaser.TilemapLayer;
    private myCar: Phaser.Sprite;
    private cars: Phaser.Sprite[];
    private cursors: Phaser.CursorKeys;
    private speed: number;
    private lapText: Phaser.Text;
    private lapFlg: number;
    private currentLap: number;
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
      this.map.setTileIndexCallback([6, 14, 22], this.checkPoint1, this);
      this.map.setTileIndexCallback([7, 15, 23], this.checkPoint2, this);
      this.map.setTileIndexCallback([8, 16, 24], this.checkPoint3, this);

      this.layer = this.map.createLayer('Ground');
      this.layer.resizeWorld();
      this.myCar = this.add.sprite(530, 170, 'car');
      this.myCar.anchor.setTo(0.5, 0.5);
      this.physics.arcade.enable(this.myCar);
      this.myCar.body.collideWorldBounds = true;
      this.camera.follow(this.myCar);
      this.cursors = this.input.keyboard.createCursorKeys();
      this.speed = 300;

      this.currentLap = 0;
      this.lapText = this.add.text(0, 0, this.currentLap + "/" + Main.LAP, null);
      this.lapText.anchor.set(0.5);

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

      this.roomDs.on('set', data => {
        if (data.id != this.myRoomId.toString())
          return;
        for (let i = 0; i < data.value.result.length; i++) {
          if (data.value.result[i] == this.myCarId) {
            alert("あなたは" + (i + 1) + "位でした");
            this.game.state.start('menu');
          }
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

      this.lapText.x = this.camera.x + 50;
      this.lapText.y = this.camera.y + 50;
    }

    render() {
      // this.game.debug.spriteInfo(this.myCar, 10, 10);
      // console.log(this.lapFlg);
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

    private checkPoint1(sprite: Phaser.Sprite, tile: Phaser.Tile) {
      if (this.lapFlg == 0) {
          this.lapFlg = 1;
      }
      return false;
    }

    private checkPoint2(sprite: Phaser.Sprite, tile: Phaser.Tile) {
      if (this.lapFlg == 1) {
        this.currentLap++;
        this.lapText.text = this.currentLap + "/" + Main.LAP;
        if (Main.LAP <= this.currentLap) {
            this.roomDs.get(this.myRoomId.toString(), (error, data) =>{
              data.value.result.push(this.myCarId);
              this.roomDs.set(this.myRoomId.toString(), data.value);
            });
        }
      }
      this.lapFlg = 2;
      return false;
    }

    private checkPoint3(sprite: Phaser.Sprite, tile: Phaser.Tile) {
      this.lapFlg = 0;
      return false;
    }
  }
}
