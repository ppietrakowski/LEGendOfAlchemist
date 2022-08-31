import Phaser from 'phaser'
import Attribute from '../Components/Attribute'
import EnemyController from '../Components/EnemyController'
import HealthBar from '../Components/HealthBar'
import GameObject from './GameObject'
import { getRandomItem } from './Items'
import { ItemSpawner } from './ItemSpawner'
import Player from './Player'


export default class Enemy extends GameObject {
    static readonly ENEMY_ATTACKED = "EnemyAttacked"

    constructor(scene: Phaser.Scene, x: number, y: number,
        texture: string | Phaser.Textures.Texture, name: string, maxRange: number, player: Player) {
        super(scene, x, y, texture, 0)
        this.name = name
        this.addComponent(new EnemyController(player, this, maxRange))
        this.addComponent(new HealthBar(this, 100, player))

        this.attributes.on(Attribute.CHARACTER_DEAD, this.killed, this)
    }

    protected killed(): void {
        let spawner = this.scene.data.get('spawner') as ItemSpawner
        let itemImage = spawner.addItem(this.x, this.y, getRandomItem())

        // add event to throw item in place of enemy
        itemImage.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, itemImage.giveToPlayer, itemImage);

        this.destroy(true)
    }
}