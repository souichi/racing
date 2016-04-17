/// <reference path="../typings/milkcocoa.d.ts"/>
/// <reference path="../Dto.ts" />

module Racing.State {
  export class Room extends Phaser.State {
    private sequenceDs: milkcocoa.DataStore<Dto.Sequence>;
    private roomDs: milkcocoa.DataStore<Dto.Room>;

    preload() {
      var milkcocoa = new MilkCocoa('readin2hef9q.mlkcca.com');
      this.sequenceDs = milkcocoa.dataStore("sequence");
      this.roomDs = milkcocoa.dataStore("room");
    }

    create() {
      this.roomDs.on("set", data => {
        if (data.value.cars.length % 2 == 0) {
          if (!data.value.matched) {
            data.value.matched = true;
            this.roomDs.set(data.id.toString(), data.value);
          }
          this.roomDs.off('set');
          this.game.state.start('main');
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
                cars: new Array<number>()
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
