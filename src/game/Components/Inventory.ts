
import Character from '../Entities/Character';
import Component from './Component'
import Item from './../Entities/Item'

interface Quantify {
    item: Item;
    quantify: number;
}

export default class Inventory implements Component {
    items: Array<Quantify>;
    owner: Character;

    debugName(): string {
        return this.getName();
    }

    getName(): string {
        return 'inventory';
    }

    start(character: Character): void {
        this.owner = character;
        this.items = [];
    }

    addItem(item: Item) {
        var found: boolean = false;

        this.items.forEach((p: Quantify) => { if (p.item === item && !found) { found = true; p.quantify++;}})
    }

    deleteItem(index: number) {
        for (let i = 0; i < this.items.length; i++) {
            if (i === index)
                this.items.splice(i, 1);
        }
    }

    update(timeSinceLastFrame: number): void {

    }
}