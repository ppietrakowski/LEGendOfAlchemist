import Phaser from 'phaser'

import Component from './Component'

import Character from '../Entities/Character'
import Player from '../Entities/Player'
import Enemy from '../Entities/Enemy'
import Effect from './Effect'

export default class PlayerCombat implements Component {
    player: Player;
    timeSinceLastFrame: number;

    debugName(): string {
        return 'player-combat';
    }

    getName(): string {
        return 'player-combat';
    }

    start(character: Character): void {
        this.player = character as Player;
        this.timeSinceLastFrame = 0;
    }

    addEnemy(enemy: Enemy): void {
        enemy.sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
           enemy.attributes.addEffect(new Effect(10 * this.timeSinceLastFrame * -this.player.attributes.strength, 0, 0, 0.5)); 
        });
    }

    update(timeSinceLastFrame: number): void {
        this.timeSinceLastFrame = timeSinceLastFrame;
    }
}