import Phaser, { Physics } from 'phaser'

import Player from './Player';

export default class Portal {
    name: string;
    player: Player;
    sprite: Phaser.Physics.Arcade.Sprite;

    constructor(name: string, sprite: Phaser.Physics.Arcade.Sprite, player: Player, endPoint: Phaser.Math.Vector2) {
        console.log('Portal created')
        this.player = player
        this.sprite = sprite;
        
        this.sprite.scene.physics.add.overlap(this.sprite, this.player.sprite, () => { player.sprite.setX(endPoint.x); player.sprite.setY(endPoint.y); });
        sprite.setInteractive();
    }
}