import Phaser from 'phaser'
import { SensingListener } from '../Components/AI/sense/EnemySensing'
import Attribute from '../Components/Attribute'
import Controller from '../Components/Controller'
import EnemyController from '../Components/EnemyController'
import { HealthBar } from '../Components/HealthBar'
import GameObject from './GameObject'
import { getRandomItem } from './Items'
import { ItemSpawner } from './ItemSpawner'
import Player from './Player'


export default class Enemy extends GameObject {
    static readonly ENEMY_ATTACKED = Symbol('EnemyAttacked')

    constructor(scene: Phaser.Scene, x: number, y: number,
        texture: string | Phaser.Textures.Texture, name: string, maxRange: number, player: Player) {
        super(scene, x, y, texture, 0)
        this.name = name
        this.addComponent(new EnemyController(player, this, maxRange))
        this.addComponent(new HealthBar(this, player))

        this.attributes.on(Attribute.CHARACTER_DEAD, this.killed, this)
    }

    protected killed(): void {
        const spawner = this.scene.data.get('spawner') as ItemSpawner
        let itemImage = spawner.addItem(this.x, this.y, getRandomItem())

        // add event to throw item in place of enemy
        itemImage.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, itemImage.giveToPlayer, itemImage)
        itemImage = null

        this.destroy()
    }

    get controller(): Controller {
        return this.getComponent<EnemyController>(EnemyController.COMPONENT_NAME)
    }

    addSenseListener(listener: SensingListener): void {
        const controller = this.getComponent<EnemyController>(EnemyController.COMPONENT_NAME)
        controller.addSenseListener(listener)
    }
}