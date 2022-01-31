import Phaser from 'phaser'

import Component from './Component'
import Effect from './Effect'

import Character from '../Entities/Character'
import Player from '../Entities/Player'
import Enemy from '../Entities/Enemy'

export default class PlayerCombat implements Component {
    player: Player;
    timeSinceLastFrame: number;

    constructor() {
    }

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
        let scene = enemy.sprite.scene;
        if (this.player.isNearObject(enemy.sprite, 5 * this.player.attributes.strength) && !this.player.hasAttacked ) {
            let throwable = scene.add.image(this.player.sprite.x, this.player.sprite.y, 'potion');

            scene.sound.add('potion-throwed').play();
            this.throw(throwable, enemy);
        }
    }

    throw(throwable: Phaser.GameObjects.Image, enemy: Enemy) {
        let duration = 100 * 
            Phaser.Math.Distance.Between(enemy.sprite.x, enemy.sprite.y, this.player.sprite.x, this.player.sprite.y) * this.timeSinceLastFrame;

        throwable.setRotation(Math.PI / 360)

        this.player.hasAttacked = true;
        
        throwable.scene.tweens.add({
            targets: [throwable],
            ease: 'linear',
            duration: duration,
            x: enemy.sprite.x,
            y: enemy.sprite.y,
            onComplete: () => {
                throwable.scene.sound.add('potion-hit').play();
                enemy.attributes.addEffect(new Effect(100 * this.timeSinceLastFrame * -this.player.attributes.strength, 0, 0, 0.5));
                this.player.hasAttacked = false;
                throwable.destroy();
            }
        });
    }
}