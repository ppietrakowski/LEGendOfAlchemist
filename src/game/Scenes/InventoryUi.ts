import Phaser from 'phaser'

import Character from '../Entities/Character'
import Item from '../Entities/Item';

import Inventory from '../Components/Inventory'

export default class InventoryUi extends Phaser.Scene {
    inventory: Inventory;
    background: Phaser.GameObjects.Sprite;
    container: Phaser.GameObjects.Container;
    maxRow: number = 5;
    title: Phaser.GameObjects.Text;
    keyI: Phaser.Input.Keyboard.Key;

    constructor() {
        super('Inventory');
        this.inventory = null;
    }

    debugName(): string {
        return " " + this;
    }

    getName(): string {
        return 'inventory-UI';
    }

    addElement(item: Item): void {
        this.container.add(item.sprite);
        item.sprite.setScrollFactor(0);
        this.updatePosition();
    }

    deleteChild(child: Phaser.GameObjects.Sprite): void {
        this.container.each((ch: Phaser.GameObjects.Sprite) => { if (ch === child) this.container.remove(child); });
        this.updatePosition();
    }

    create() {
        this.container = this.add.container(50, 60);
        this.container.setScrollFactor(0);

        this.background = this.add.sprite(0, 60, 'inventory-background').setOrigin(0, 0);
        this.container.add(this.background);

        this.title = this.add.text(20, 60, 'Inventory');
        this.container.add(this.title);
        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    }

    update(time: number, delta: number): void {
        if (this.keyI.isDown) {
            this.game.scene.game.scene.pause('Inventory');
            this.scene.setVisible(false);
            this.game.scene.game.scene.run('GameScene');
        }
    }

    updatePosition(): void {
        let currentRow = 0;
        let heigth = 65;

        this.container.each((child: Phaser.GameObjects.GameObject) => {
            if (child != this.background && child != this.title) {
                let ch = child as Phaser.GameObjects.Sprite;
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