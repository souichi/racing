/// <reference path="../typings/milkcocoa.d.ts"/>
/// <reference path="../Dto.ts" />

module Racing.State {
  export class Room extends Phaser.State {
    static MAX = 3;
    private sequenceDs: milkcocoa.DataStore<Dto.Sequence>;
    private roomDs: milkcocoa.DataStore<Dto.Room>;

    preload() {
      var milkcocoa = new MilkCocoa('readin2hef9q.mlkcca.com');
      this.sequenceDs = milkcocoa.dataStore("sequence");
      this.roomDs = milkcocoa.dataStore("room");
    }

    create() {
      var diameter = 100;
      var margin = this.world.width - (diameter*Room.MAX);
      for (let i = 0; i < Room.MAX; i++) {
        var graphics = this.add.graphics(0, 0);
        graphics.beginFill(0xFF0000, 1);
        graphics.drawCircle(diameter * i + diameter/2 + margin/2, this.world.centerY, diameter);
      }

      this.roomDs.on("set", data => {
        for (let i = 0; i < data.value.cars.length; i++) {
          var graphics = this.add.graphics(0, 0);
          graphics.beginFill(0x00FF00, 1);
          graphics.drawCircle(diameter * i + diameter/2 + margin/2, this.world.centerY, diameter);
        }
        if (data.value.cars.length % Room.MAX == 0) {
          if (!data.value.matched) {
            data.value.matched = true;
            this.roomDs.set(data.id.toString(), data.value);
          }
          this.roomDs.off('set');
          var count = 3;
          var current = count;
          var countDownText = this.add.text(this.world.centerX, this.world.centerY, current.toString(), null);
          countDownText.anchor.set(0.5);
          var intervalId = setInterval(() => {
            current--;
            countDownText.text = current.toString();
            if (current <= 0) {
              clearInterval(intervalId);
              this.game.state.start('main');
            }
          }, count * 500);
        }
      });

      this.sequenceDs.get('car', (error, data) => {
        var carId = error ? 1 : data.value.id;
        this.sequenceDs.set("car", { id: carId + 1 });
        this.game.state.states['main'].setMyCarId(carId);
        this.sequenceDs.get('room', (error, data) => {
          var roomId = error ? 1 : data.value.id;
          this.roomDs.get(roomId.toString(), (error, data) => {
            if (error || data.value.matched) {
              roomId++;
              this.sequenceDs.set('room', { id: roomId });
              var room = <Dto.Room>{
                matched: false,
                cars: new Array<number>(),
                result: new Array<number>(),
              };
              room.cars.push(carId);
              this.roomDs.set(roomId.toString(), room);
            } else {
              data.value.cars.push(carId);
              this.roomDs.set(roomId.toString(), data.value);
            }
            this.game.state.states['main'].setMyRoomId(roomId);
          });
        });
      });
    }
  }
}
