var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Racing;
(function (Racing) {
    var State;
    (function (State) {
        var Boot = (function (_super) {
            __extends(Boot, _super);
            function Boot() {
                _super.apply(this, arguments);
            }
            Boot.prototype.preload = function () {
                this.load.image('preload-bar', 'assets/images/preload-bar.png');
            };
            Boot.prototype.create = function () {
                this.game.stage.backgroundColor = 0xFFFFFF;
                // Assign global settings here
                this.game.state.start('preload');
            };
            return Boot;
        })(Phaser.State);
        State.Boot = Boot;
    })(State = Racing.State || (Racing.State = {}));
})(Racing || (Racing = {}));
var Racing;
(function (Racing) {
    var State;
    (function (State) {
        var Preload = (function (_super) {
            __extends(Preload, _super);
            function Preload() {
                _super.apply(this, arguments);
            }
            Preload.prototype.preload = function () {
                this.preloadBar = this.add.sprite(0, 148, 'preload-bar');
                this.load.setPreloadSprite(this.preloadBar);
                //this.load.image('menu-background', 'assets/images/menu-background.png');
                // Load remaining assets here
                this.load.tilemap('desert', 'assets/tilemaps/maps/desert.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.image('tiles', 'assets/tilemaps/tiles/tmw_desert_spacing.png');
                this.load.image('car', 'assets/sprites/car90.png');
            };
            Preload.prototype.create = function () {
                this.game.state.start('menu');
            };
            return Preload;
        })(Phaser.State);
        State.Preload = Preload;
    })(State = Racing.State || (Racing.State = {}));
})(Racing || (Racing = {}));
var Racing;
(function (Racing) {
    var State;
    (function (State) {
        var Menu = (function (_super) {
            __extends(Menu, _super);
            function Menu() {
                _super.apply(this, arguments);
            }
            Menu.prototype.create = function () {
                this.game.state.start('room');
                // this.background = this.add.sprite(80, 0, 'menu-background');
                // this.input.onDown.addOnce(() => {
                //   this.game.state.start('main');
                // });
            };
            return Menu;
        })(Phaser.State);
        State.Menu = Menu;
    })(State = Racing.State || (Racing.State = {}));
})(Racing || (Racing = {}));
var Racing;
(function (Racing) {
    var Dto;
    (function (Dto) {
        var Sequence = (function () {
            function Sequence() {
            }
            return Sequence;
        })();
        Dto.Sequence = Sequence;
        var Room = (function () {
            function Room() {
            }
            return Room;
        })();
        Dto.Room = Room;
        var Car = (function () {
            function Car() {
            }
            return Car;
        })();
        Dto.Car = Car;
    })(Dto = Racing.Dto || (Racing.Dto = {}));
})(Racing || (Racing = {}));
/// <reference path="../typings/milkcocoa.d.ts"/>
/// <reference path="../Dto.ts" />
var Racing;
(function (Racing) {
    var State;
    (function (State) {
        var Car = (function (_super) {
            __extends(Car, _super);
            function Car(id, game, x, y) {
                _super.call(this, game, x, y, 'car');
                this.id = id;
            }
            return Car;
        })(Phaser.Sprite);
        var Main = (function (_super) {
            __extends(Main, _super);
            function Main() {
                _super.apply(this, arguments);
            }
            Main.prototype.preload = function () {
                var milkcocoa = new MilkCocoa('readin2hef9q.mlkcca.com');
                this.roomDs = milkcocoa.dataStore("room");
                this.carDs = milkcocoa.dataStore("car");
            };
            Main.prototype.create = function () {
                var _this = this;
                this.stage.backgroundColor = 0x000000;
                // Create game objects here
                this.physics.startSystem(Phaser.Physics.ARCADE);
                this.map = this.add.tilemap('desert');
                this.map.addTilesetImage('Desert', 'tiles');
                this.map.setCollisionByExclusion([4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 22, 23, 24, 30]);
                this.map.setTileIndexCallback(31, this.hit, this);
                this.layer = this.map.createLayer('Ground');
                this.layer.resizeWorld();
                this.myCar = this.add.sprite(530, 170, 'car');
                this.myCar.anchor.setTo(0.5, 0.5);
                this.physics.arcade.enable(this.myCar);
                this.myCar.body.collideWorldBounds = true;
                this.camera.follow(this.myCar);
                this.cursors = this.input.keyboard.createCursorKeys();
                this.roomDs.get(this.myRoomId.toString(), function (error, data) {
                    _this.cars = new Array();
                    for (var i = 0; i < data.value.cars.length; i++) {
                        var carId = data.value.cars[i];
                        if (carId == _this.myCarId)
                            continue;
                        var car = _this.add.sprite(530, 170, 'car');
                        car.id = carId; // TODO:
                        car.anchor.setTo(0.5, 0.5);
                        _this.cars.push(car);
                    }
                });
                this.carDs.on('set', function (data) {
                    for (var i = 0; i < _this.cars.length; i++) {
                        var car = _this.cars[i];
                        if (car.id.toString() != data.id)
                            continue;
                        car.rotation = data.value.rotation;
                        car.position.x = data.value.x;
                        car.position.y = data.value.y;
                    }
                });
            };
            Main.prototype.update = function () {
                this.physics.arcade.collide(this.myCar, this.layer);
                this.myCar.body.velocity.x = 0;
                this.myCar.body.velocity.y = 0;
                this.myCar.body.angularVelocity = 0;
                if (this.cursors.left.isDown) {
                    this.myCar.body.angularVelocity = -200;
                }
                else if (this.cursors.right.isDown) {
                    this.myCar.body.angularVelocity = 200;
                }
                if (this.cursors.up.isDown) {
                    this.myCar.body.velocity.copyFrom(this.physics.arcade.velocityFromAngle(this.myCar.angle, 300));
                }
                else if (this.cursors.down.isDown) {
                    this.myCar.body.velocity.copyFrom(this.physics.arcade.velocityFromAngle(this.myCar.angle, -100));
                }
                this.carDs.set(this.myCarId.toString(), {
                    x: this.myCar.position.x,
                    y: this.myCar.position.y,
                    rotation: this.myCar.rotation
                });
            };
            Main.prototype.render = function () {
                this.game.debug.spriteInfo(this.myCar, 10, 10);
            };
            Main.prototype.setMyCarId = function (carId) {
                this.myCarId = carId;
            };
            Main.prototype.setMyRoomId = function (roomId) {
                this.myRoomId = roomId;
            };
            Main.prototype.hit = function (sprite, tile) {
                tile.alpha = 0.2;
                this.layer.dirty = true;
                return false;
            };
            return Main;
        })(Phaser.State);
        State.Main = Main;
    })(State = Racing.State || (Racing.State = {}));
})(Racing || (Racing = {}));
/// <reference path="../typings/milkcocoa.d.ts"/>
/// <reference path="../Dto.ts" />
var Racing;
(function (Racing) {
    var State;
    (function (State) {
        var Room = (function (_super) {
            __extends(Room, _super);
            function Room() {
                _super.apply(this, arguments);
            }
            Room.prototype.preload = function () {
                var milkcocoa = new MilkCocoa('readin2hef9q.mlkcca.com');
                this.sequenceDs = milkcocoa.dataStore("sequence");
                this.roomDs = milkcocoa.dataStore("room");
            };
            Room.prototype.create = function () {
                var _this = this;
                this.roomDs.on("set", function (data) {
                    if (data.value.cars.length % 2 == 0) {
                        if (!data.value.matched) {
                            data.value.matched = true;
                            _this.roomDs.set(data.id.toString(), data.value);
                        }
                        _this.roomDs.off('set');
                        _this.game.state.start('main');
                    }
                });
                this.sequenceDs.get('car', function (error, data) {
                    var carId = error ? 1 : data.value.id;
                    _this.sequenceDs.set("car", { id: carId + 1 });
                    _this.game.state.states['main'].setMyCarId(carId);
                    _this.sequenceDs.get('room', function (error, data) {
                        var roomId = error ? 1 : data.value.id;
                        _this.roomDs.get(roomId.toString(), function (error, data) {
                            if (error || data.value.matched) {
                                roomId++;
                                _this.sequenceDs.set('room', { id: roomId });
                                var room = {
                                    matched: false,
                                    cars: new Array()
                                };
                                room.cars.push(carId);
                                _this.roomDs.set(roomId.toString(), room);
                            }
                            else {
                                data.value.cars.push(carId);
                                _this.roomDs.set(roomId.toString(), data.value);
                            }
                            _this.game.state.states['main'].setMyRoomId(roomId);
                        });
                    });
                });
            };
            return Room;
        })(Phaser.State);
        State.Room = Room;
    })(State = Racing.State || (Racing.State = {}));
})(Racing || (Racing = {}));
/// <reference path="../vendor/phaser-official/typescript/phaser.d.ts"/>
/// <reference path='State/Boot.ts'/>
/// <reference path='State/Preload.ts'/>
/// <reference path='State/Menu.ts'/>
/// <reference path='State/Main.ts'/>
/// <reference path='State/Room.ts'/>
var Racing;
(function (Racing) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 640, 480, Phaser.AUTO, 'game-div');
            this.state.add('boot', Racing.State.Boot);
            this.state.add('preload', Racing.State.Preload);
            this.state.add('menu', Racing.State.Menu);
            this.state.add('main', Racing.State.Main);
            this.state.add('room', Racing.State.Room);
            this.state.start('boot');
        }
        return Game;
    })(Phaser.Game);
    Racing.Game = Game;
})(Racing || (Racing = {}));
window.onload = function () {
    var game = new Racing.Game();
};
//# sourceMappingURL=main.js.map