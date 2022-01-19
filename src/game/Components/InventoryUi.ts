import Phaser, { Game } from 'phaser'

import Character from '../Entities/Character'

import Component from './Component'
import Inventory from './Inventory'

export default class InventoryUi implements Component {
    inventory: Inventory;
    background: Phaser.GameObjects.Sprite;
    container: Phaser.GameObjects.Container;
    maxRow: number = 5;
    visible: boolean;
    title: Phaser.GameObjects.Text;

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
    }

    deleteChild(child: Phaser.GameObjects.Sprite) {
        this.container.each((ch: Phaser.GameObjects.Sprite) => { if (ch === child) this.container.remove(child); });
        this.updatePosition();
    }

    start(character: Character): void {


        this.container = character.sprite.scene.add.container(50, 60);
        this.background = character.sprite.scene.add.sprite(0, 60, 'inventory-background').setOrigin(0, 0);
        
        this.container.add(this.background);
        this.title = character.sprite.scene.add.text(20, 60, 'Inventory');
        this.container.add(this.title);
        this.container.setScrollFactor(0);
    }

    update(timeSinceLastFrame: number): void {
        this.container.visible = this.visible;

        if (this.inventory.hasItemsUpdate) {
            this.updatePosition();
        }

    }

    updatePosition() {
        var currentRow = 0;
        var heigth = 65;

        this.container.each((child: Phaser.GameObjects.GameObject) => {
            if (child != this.background && child != this.title) {
                var ch = child as Phaser.GameObjects.Sprite;
                ch.setPosition(5 + 24 * currentRow, heigth);
                ++currentRow;
                if (currentRow === this.maxRow) {
                    heigth += 16;
                    currentRow = 0;
                }
            } else if (child === this.title)
                heigth += 16;
        });
        this.inventory.hasItemsUpdate = false;
    }




}