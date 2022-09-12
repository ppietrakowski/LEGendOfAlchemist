import Phaser, { Tweens } from 'phaser'
import Enemy from '../Entities/Enemy'
import GameObject from '../Entities/GameObject'
import Player from '../Entities/Player'
import { Component } from './Component'
import TimedEffect from './Effects/TimedEffect'


export default class PlayerCombat implements Component {
    private _cachedDeltaTime: number
    private _attacked: boolean

    static readonly COMPONENT_NAME = 'player-combat'
    constructor(private player: Player) {
        this._cachedDeltaTime = 0
        this._attacked = false

        this.player.on(GameObject.GAMEOBJECT_UPDATE, this.cacheDeltaTime, this)
    }
    
    private cacheDeltaTime(deltaTime: number) {
        this._cachedDeltaTime = deltaTime
    }

    destroy(): void {
        this.player = null
    }

    getName(): string {
        return PlayerCombat.COMPONENT_NAME
    }
    
    private potionHitEnemy(throwable: Phaser.GameObjects.Image, enemy: Enemy) {
        throwable.scene.sound.add('potion-hit').play()
        enemy.attributes.applyEffect(new TimedEffect(24 * this._cachedDeltaTime * -this.player.attributes.strength, 0, 0, 0.5))
        this._attacked = false
        throwable.destroy()
    }

    private getTweenConfig(throwable: Phaser.GameObjects.Image, enemy: Enemy, duration: number): object {
        return {
            targets: [throwable],
            ease: 'linear',
            duration: duration,
            x: enemy.x,
            y: enemy.y,
            onComplete: () => this.potionHitEnemy(throwable, enemy),
        }
    }

    private throw(throwable: Phaser.GameObjects.Image, enemy: Enemy) {
        const duration = 100 *
            Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y) * this._cachedDeltaTime

        throwable.setRotation(Math.PI / 360)

        this._attacked = true

        throwable.scene.tweens.add(this.getTweenConfig(throwable, enemy, duration))
    }

    private onThrowAnything(enemy: Enemy) {
        const { scene } = enemy
        if (this.player.isNearObject(enemy, 10 * this.player.attributes.strength.value) && !this._attacked) {
            const throwable = scene.add.image(this.player.x, this.player.y, 'potion')
            this.throw(throwable, enemy)
        }
    }

    addEnemy(enemy: Enemy): void {
        enemy.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.onThrowAnything(enemy))
    }
}