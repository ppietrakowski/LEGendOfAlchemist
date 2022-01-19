import Phaser, { Game } from 'phaser'

import Character from '../Entities/Character'

import Component from './Component'
import Inventory from './Inventory'

export default class InventoryUi implements Component {
    inventory: Inventory;
    background: Phaser.GameObjects.Sprite;
    container: Phaser.GameObjects.Container;
    maxRow: number = 4;
    currentRow: number = 0;
    heigth: number;

    visible: boolean;


    constructor(inventory: Inventory) {
        this.inventory = inventory;
        this.visible = true;
    }

    debugName(): string {
        return " " + this;
    }

    getName(): string {
        return 'inventory-UI';
    }

    addElement(child: Phaser.GameObjects.Sprite) {
        this.container.add(child);
        this.updatePosition();
        child.setVisible(true);
        child.setScrollFactor(0);
    }

    deleteChild(child: Phaser.GameObjects.Sprite) {
        this.container.each((ch: Phaser.GameObjects.Sprite) => { if (ch === child) this.container.remove(child); });
        this.updatePosition();
    }

    start(character: Character): void {


        this.container = character.sprite.scene.add.container(50, 60);
        this.container.add(character.sprite.scene.add.sprite(50, 60, 'inventory-background').setOrigin(0, 0));
        this.container.setScrollFactor(0);
        
        this.heigth = 60;
    }

    update(timeSinceLastFrame: number): void {
        this.container.visible = this.visible;

        if (this.inventory.hasItemsUpdate) {
            this.updatePosition();
        }

    }

    updatePosition() {
        this.currentRow = 0;
        this.heigth = 60;
        this.container.each((child: Phaser.GameObjects.Sprite) => {
            child.setPosition(50 + 16 * this.currentRow, this.heigth).setOrigin(0, 0);

            ++this.currentRow;
            if (this.currentRow === this.maxRow) {
                this.heigth += 16;
            }
        });
    }




}