import Phaser, { Physics } from 'phaser'

import Player from './Player';

export default class Portal {
    name: string;
    player: Player;
    sprite: Phaser.Physics.Arcade.Sprite;

    constructor(name: string, sprite: Phaser.Physics.Arcade.Sprite, player: Player, endPoint: Phaser.Math.Vector2, portalNo: number) {
        this.player = player
        this.sprite = sprite;

        this.sprite.scene.physics.add.overlap(this.sprite, this.player.sprite, () => { if (player.hasTeleportStone(portalNo)) { player.sprite.setX(endPoint.x); player.sprite.setY(endPoint.y);}});
        sprite.setInteractive();
        sprite.body.pushable = false;
    }
}
