
import Character from '../Entities/Character';

import Component from './Component'
import Item from './../Entities/Item'
import InventoryUi from './InventoryUi'

export default class Inventory implements Component {
    items: Array<Item>;
    owner: Character;
    hasItemsUpdate: boolean = false;
    ui: InventoryUi;

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
    }

    getItem(index: number): Item {
        return this.items[index];
    }

    addItem(item: Item) {
            this.items.push(item);
            this.hasItemsUpdate = true;
    }

    deleteItem(index: number) {
        for (let i = 0; i < this.items.length; i++) {
            if (i === index) {
                let item = this.items[i];
                item.sprite.destroy();
                this.items.splice(i, 1);
            }
        }
        this.hasItemsUpdate = true;
    }

    update(timeSinceLastFrame: number): void {
        this.ui.update(timeSinceLastFrame);
    }
}