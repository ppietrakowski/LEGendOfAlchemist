import Phaser from 'phaser';
import EnemyController from '../Components/EnemyController';
import HealthBar from '../Components/HealthBar';
import Character from './Character';
import { addAnimation } from './Enemies';
import Ingredient from './Ingredient';
import { getItemWithRandomEffect } from './Items';
import Player from './Player';


export default class Enemy extends Character {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame: string | number, name: string, maxRange: number, player: Player) {
        console.log(player)
        super(scene, x, y, texture, frame)
        this.name = name;
        this.start(scene);
        this.addComponent(new EnemyController(player, maxRange));
        this.addComponent(new HealthBar(player, 100));
    }

    start(scene: Phaser.Scene): void {
    }

    makeDead(): void {
        let player = this.getComponent<EnemyController>('enemy-movement').target;
        let ingredient: Ingredient = getItemWithRandomEffect(this.x, this.y, this.scene);

        this.getComponent<HealthBar>('hp-bar').hide();

        // add event to throw item in place of enemey
        ingredient.sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
            player.inventory.addItem(ingredient);
        });

        this.destroy();
    }
}