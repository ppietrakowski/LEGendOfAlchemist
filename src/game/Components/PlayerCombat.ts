import Phaser from 'phaser'
import Enemy from '../Entities/Enemy'
import GameObject from '../Entities/GameObject'
import Player from '../Entities/Player'
import { Component } from './Component'
import TimedEffect from './TimedEffect'


export default class PlayerCombat implements Component {
    private deltaTime: number
    private attacked: boolean

    static readonly COMPONENT_NAME = 'player-combat'
    constructor(private player: Player) {
        this.deltaTime = 0
        this.attacked = false

        this.player.on(GameObject.GAMEOBJECT_UPDATE, this.cacheDeltaTime, this)
    }

    destroy(): void {
        this.player = null
    }

    getName(): string {
        return PlayerCombat.COMPONENT_NAME;
    }

    addEnemy(enemy: Enemy): void {
        enemy.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (_p: any) => {
            this.onThrowAnything(enemy)
        });
    }

    private onThrowAnything(enemy: Enemy) {
        let { scene } = enemy
        if (this.player.isNearObject(enemy, 10 * this.player.attributes.strength.value) && !this.attacked) {
            let throwable = scene.add.image(this.player.x, this.player.y, 'potion')
            this.throw(throwable, enemy)
        }
    }

    private throw(throwable: Phaser.GameObjects.Image, enemy: Enemy) {
        let duration = 100 *
            Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y) * this.deltaTime;

        throwable.setRotation(Math.PI / 360)

        this.attacked = true

        throwable.scene.tweens.add({
            targets: [throwable],
            ease: 'linear',
            duration: duration,
            x: enemy.x,
            y: enemy.y,
            onComplete: () => {
                throwable.scene.sound.add('potion-hit').play()
                enemy.attributes.applyEffect(new TimedEffect(24 * this.deltaTime * -this.player.attributes.strength, 0, 0, 0.5))
                this.attacked = false
                throwable.destroy()
            },
        });
    }

    private cacheDeltaTime(deltaTime: number) {
        this.deltaTime = deltaTime
    }
}