import Phaser from 'phaser';
import Player from './Player';


export default class Portal {
    name: string;
    player: Player;
    sprite: Phaser.Physics.Arcade.Sprite;
    teleportSound: Phaser.Sound.BaseSound
    text: Phaser.GameObjects.Text = null

    constructor(name: string, sprite: Phaser.Physics.Arcade.Sprite, player: Player, endPoint: Phaser.Math.Vector2, portalNo: number) {
        this.player = player
        this.sprite = sprite;

        this.teleportSound = sprite.scene.sound.add('portal-sound');
        this.sprite.scene.physics.add.overlap(this.sprite, this.player.sprite, () => {
            if (player.hasTeleportStone(portalNo)) {
                this.teleportSound.play();
                player.sprite.setX(endPoint.x);
                player.sprite.setY(endPoint.y);
            } else if (this.text === null) {
                this.text = this.player.sprite.scene.add.text(player.sprite.x, player.sprite.y, 'Cannot go any futher without teleporting stone ' + portalNo);

                this.player.sprite.scene.tweens.add({
                    targets: [this.text],
                    y: '-= 100',
                    duration: 500,
                    ease: 'linear',
                    onComplete: () => {
                        this.text.destroy();
                        this.text = null;
                    }
                })
            }
        });
        sprite.setInteractive();
        sprite.body.pushable = false;
    }
}
