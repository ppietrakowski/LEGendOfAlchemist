import Phaser, { Game, Physics } from 'phaser'

import Character from '../Entities/Character'
import Item from '../Entities/Item';

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

    addElement(item: Item): void {
        //TODO: Add clickable item
        this.container.add(item.sprite);
        item.sprite.setScrollFactor(0);
        this.updatePosition();
    }

    deleteChild(child: Phaser.GameObjects.Sprite): void {
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

    updatePosition(): void {
        var currentRow = 0;
        var heigth = 65;

        this.container.each((child: Phaser.GameObjects.GameObject) => {
            if (child != this.background && child != this.title) {
                var ch = child as Phaser.GameObjects.Sprite;
                ch.x = 5 + 24 * currentRow;
                ch.y = heigth;
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