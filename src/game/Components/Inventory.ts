
import Character from '../Entities/Character';

import Component from './Component'
import Item from './../Entities/Item'
import InventoryUi from './InventoryUi'

export default class Inventory implements Component {
    items: Array<Item>;
    owner: Character;
    hasItemsUpdate: boolean = false;
    ui: InventoryUi;
    keyI: Phaser.Input.Keyboard.Key;

    debugName(): string {
        return this.getName();
    }

    getName(): string {
        return 'inventory';
    }

    start(character: Character): void {
        let keyboard = character.sprite.scene.input.keyboard;

        this.owner = character;
        this.items = [];
        this.ui = new InventoryUi(this);
        this.ui.start(character);

        this.keyI = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    }

    getItem(index: number): Item {
        return this.items[index];
    }

    addItem(item: Item) {
        this.items.push(item);
        this.hasItemsUpdate = true;
        this.ui.addElement(item);
    }

    deleteItem(item: Item) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] === item) {
                this.ui.deleteChild(item.sprite);
                item.sprite.destroy();
                this.items.splice(i, 1);
            }
        }
        this.hasItemsUpdate = true;
    }

    update(timeSinceLastFrame: number): void {
        if (this.keyI.isDown)
            this.ui.visible = !this.ui.visible;
        this.ui.update(timeSinceLastFrame);
    }
}