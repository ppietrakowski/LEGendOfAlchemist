import Phaser from 'phaser'

import Component from './Component'

import Character from '../Entities/Character'
import Player from '../Entities/Player'
import Enemy from '../Entities/Enemy'
import Effect from './Effect'
import EnemyController from './EnemyController'

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
            this.onThrowAnything(enemy);
        });
    }

    update(timeSinceLastFrame: number): void {
        this.timeSinceLastFrame = timeSinceLastFrame;
    }

    onThrowAnything(enemy: Enemy) {

        let throwable = enemy.sprite.scene.add.image(this.player.sprite.x, this.player.sprite.y, 'potion');
        let duration = 100 * Phaser.Math.Distance.Between(enemy.sprite.x, enemy.sprite.y, this.player.sprite.x, this.player.sprite.y) * this.timeSinceLastFrame;

        throwable.setRotation(Math.PI / 360)
        throwable.scene.tweens.add({
            targets: [throwable],
            ease: 'linear',
            duration: duration,
            x: enemy.sprite.x,
            y: enemy.sprite.y,
            onComplete: () => { enemy.attributes.addEffect(new Effect(100 * this.timeSinceLastFrame * -this.player.attributes.strength, 0, 0, 0.5)); throwable.destroy(); }
        });
    }
}