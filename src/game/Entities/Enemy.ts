import Phaser from 'phaser';
import EnemyController from '../Components/EnemyController';
import HealthBar from '../Components/HealthBar';
import Character from './Character';
import { addAnimation } from './Enemies';
import Ingredient from './Ingredient';
import { getItemWithRandomEffect } from './Items';
import Player from './Player';


export default class Enemy extends Character {
    name: string;

    constructor(name: string, maxRange: number, sprite: Phaser.Physics.Arcade.Sprite, player: Player) {
        super(sprite);
        this.name = name;
        this.start(sprite.scene);
        this.addComponent(new EnemyController(player, maxRange));
        this.addComponent(new HealthBar(player, 100));
        addAnimation(this.sprite, name);
    }

    start(scene: Phaser.Scene): void {
    }

    makeDead(): void {
        let player = this.getComponent<EnemyController>('enemy-movement').target;
        let ingredient: Ingredient = getItemWithRandomEffect(this.sprite.x, this.sprite.y, this.sprite.scene);

        this.getComponent<HealthBar>('hp-bar').hide();

        // add event to throw item in place of enemey
        ingredient.sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
            player.inventory.addItem(ingredient);
        });

        this.sprite.destroy();
    }
}