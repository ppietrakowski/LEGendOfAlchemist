import Phaser from 'phaser';
import Item from '../Entities/Item';

class Field {
    item: Item
    backgroundImage: Phaser.GameObjects.Image

    constructor(item: Item, backgroundImage: Phaser.GameObjects.Image) {
        this.item = item;
        this.backgroundImage = backgroundImage;
    }
}

const MaxItemsForCraft = 4;

export default class Crafting extends Phaser.Scene {

    items: Array<Field>

    constructor() {
        super('Crafting');
    }

    preload(): void {
        this.load.image('item-background', 'assets/temp/item-background.png');
        this.items = []
    }

    create(): void {
        for (let i = 0; i < MaxItemsForCraft; i++) {
            let field = new Field(null, this.add.image(120 + i * 24, 120, 'item-background'));
            this.items.push(field)
        }
    }

    update(time: number, delta: number): void {
        
    }
}