import Phaser from 'phaser'
import Enemy from '../Entities/Enemy'
import Player from '../Entities/Player'
import Attribute from './Attribute'
import { Component, addToUpdateList } from './Component'
import Effect from './Effect'


export default class PlayerCombat implements Component {
    private deltaTime: number
    private attacked: boolean

    constructor(private player: Player) {
        this.deltaTime = 0
        this.attacked = false

        addToUpdateList(this.player.scene, this.cacheDeltaTime, this)
    }

    private cacheDeltaTime(_time: number, deltaTime: number) {
        this.deltaTime = deltaTime
    }

    destroy(): void {
        this.player.attributes.removeAllListeners(Attribute.CHARACTER_DEAD)
        this.player.scene.events.off(Phaser.Scenes.Events.UPDATE, this.cacheDeltaTime, this)
        this.player = null
    }

    getName(): string {
        return 'player-combat'
    }

    addEnemy(enemy: Enemy): void {
        enemy.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
            this.onThrowAnything(enemy)
        });
    }

    onThrowAnything(enemy: Enemy) {
        let { scene } = enemy
        if (this.player.isNearObject(enemy, 5 * this.player.attributes.strength.value) && !this.attacked) {
            let throwable = scene.add.image(this.player.x, this.player.y, 'potion')

            scene.sound.add('potion-throwed').play()
            this.throw(throwable, enemy)
        }
    }

    throw(throwable: Phaser.GameObjects.Image, enemy: Enemy) {
        let duration = 100 *
            Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y) * this.deltaTime

        throwable.setRotation(Math.PI / 360)

        this.attacked = true

        throwable.scene.tweens.add({
            targets: [throwable],
            ease: 'linear',
            duration,
            x: enemy.x,
            y: enemy.y,
            onComplete: () => {
                throwable.scene.sound.add('potion-hit').play()
                enemy.attributes.addEffect(new Effect(24 * this.deltaTime * -this.player.attributes.strength, 0, 0, 0.5))
                this.attacked = false
                throwable.destroy()
            }
        });
    }
}