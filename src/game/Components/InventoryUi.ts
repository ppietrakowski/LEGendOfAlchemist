import Phaser from 'phaser'

import Character from '../Entities/Character'

import Component from './Component'
import Inventory from './Inventory'

export default class InventoryUi implements Component {
    inventory: Inventory;
    background: Phaser.GameObjects.Sprite;

    constructor(inventory: Inventory) {
        this.inventory = inventory;
    }

    debugName(): string {
        return " " + this;
    }

    getName(): string {
        return 'inventory-UI';
    }

    start(character: Character): void {
        this.background = character.sprite.scene.add.sprite(300, 300, 'inventory-background');
    }

    update(timeSinceLastFrame: number): void {
        
    }




}