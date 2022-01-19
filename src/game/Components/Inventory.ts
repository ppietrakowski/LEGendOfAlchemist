
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
        this.owner = character;
        this.items = [];
        this.ui = new InventoryUi(this);
        this.ui.start(character);

        this.keyI = character.sprite.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    }

    getItem(index: number): Item {
        return this.items[index];
    }

    addItem(item: Item) {
            this.items.push(item);
            this.hasItemsUpdate = true;
            this.ui.addElement(item.sprite);
    }

    deleteItem(index: number) {
        for (let i = 0; i < this.items.length; i++) {
            if (i === index) {
                let item = this.items[i];
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