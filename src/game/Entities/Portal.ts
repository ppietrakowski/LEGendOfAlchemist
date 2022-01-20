import Phaser, { Physics } from 'phaser'

import Player from './Player';

export default class Portal {
    name: string;
    player: Player;
    sprite: Phaser.Physics.Arcade.Sprite;

    constructor(name: string, sprite: Phaser.Physics.Arcade.Sprite, player: Player) {
        console.log('Portal created')
        this.player = player
        this.sprite = sprite;
        
        
        this.sprite.scene.physics.add.overlap(this.sprite, this.player.sprite, () => { player.sprite.setX(1500); player.sprite.setY(1500); });
        sprite.setInteractive();
    }
}
