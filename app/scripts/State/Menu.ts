module Racing.State {
  export class Menu extends Phaser.State {
    background: Phaser.Sprite;

    create() {
      this.game.state.start('main');
      // this.background = this.add.sprite(80, 0, 'menu-background');
      // this.input.onDown.addOnce(() => {
      //   this.game.state.start('main');
      // });
    }
  }
}
