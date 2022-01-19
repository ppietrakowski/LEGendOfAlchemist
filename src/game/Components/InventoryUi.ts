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
        this.background = character.sprite.scene.add.sprite(50, 60, 'inventory-background').setOrigin(0, 0);
        this.background.setScale(1.5, 2);
        
        this.background.setScrollFactor(0);
    }

    update(timeSinceLastFrame: number): void {
        
    }




}