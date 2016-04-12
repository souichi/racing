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
                this.game.state.start('main');
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
    var State;
    (function (State) {
        var Main = (function (_super) {
            __extends(Main, _super);
            function Main() {
                _super.apply(this, arguments);
            }
            Main.prototype.create = function () {
                this.stage.backgroundColor = 0x000000;
                // Create game objects here
                this.physics.startSystem(Phaser.Physics.ARCADE);
                this.map = this.add.tilemap('desert');
                this.map.addTilesetImage('Desert', 'tiles');
                this.map.setCollisionByExclusion([4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 22, 23, 24, 30]);
                this.map.setTileIndexCallback(31, this.hit, this);
                this.layer = this.map.createLayer('Ground');
                this.layer.resizeWorld();
                this.car = this.add.sprite(530, 170, 'car');
                this.car.anchor.setTo(0.5, 0.5);
                this.physics.arcade.enable(this.car);
                this.car.body.collideWorldBounds = true;
                this.camera.follow(this.car);
                this.cursors = this.input.keyboard.createCursorKeys();
            };
            Main.prototype.update = function () {
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
                }
                else if (this.cursors.down.isDown) {
                    this.car.body.velocity.copyFrom(this.physics.arcade.velocityFromAngle(this.car.angle, -100));
                }
            };
            Main.prototype.render = function () {
                this.game.debug.spriteInfo(this.car, 10, 10);
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
/// <reference path="../vendor/phaser-official/typescript/phaser.d.ts"/>
/// <reference path='State/Boot.ts'/>
/// <reference path='State/Preload.ts'/>
/// <reference path='State/Menu.ts'/>
/// <reference path='State/Main.ts'/>
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