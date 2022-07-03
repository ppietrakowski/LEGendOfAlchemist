import Phaser from 'phaser'
import Attribute from '../Components/Attribute'
import EnemyController from '../Components/EnemyController'
import HealthBar from '../Components/HealthBar'
import Character from './Character'
import Ingredient from './Ingredient'
import { getItemWithRandomEffect } from './Items'
import Player from './Player'


export default class Enemy extends Character {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, name: string, maxRange: number, player: Player) {
        super(scene, x, y, texture, 0)
        this.name = name
        this.addComponent(new EnemyController(player, maxRange))
        this.addComponent(new HealthBar(player, 100))

        this.attributes.on(Attribute.CharacterDead, this.killed, this)
    }

    protected killed(): void {
        let player = this.getComponent<EnemyController>('enemy-movement').target
        let ingredient = getItemWithRandomEffect(this.x, this.y, player.scene) as Ingredient

        // add event to throw item in place of enemy
        ingredient.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (pointer: Phaser.Input.Pointer) => player.inventory.addItem(ingredient));

        this.destroy(true)
    }
}