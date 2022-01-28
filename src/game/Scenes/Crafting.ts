import Phaser from 'phaser';
import Button from '../Entities/Button';
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
    craft: Button

    constructor() {
        super('Crafting');
    }

    preload(): void {
        this.load.image('item-background', 'assets/temp/item-background.png')
        this.load.image('craft-item', 'assets/buttons/craft.png')
        this.items = []
    }

    create(): void {
        for (let i = 0; i < MaxItemsForCraft; i++) {
            let field = new Field(null, this.add.image(120 + i * 24, 120, 'item-background'));
            this.items.push(field)
        }
        this.craft = new Button(this, 430, 430, 'craft-item', () => { this.onCraft() });
    }

    update(time: number, delta: number): void {
        
    }

    onCraft(): void {

        // for now just get back to gamescene
        this.game.scene.stop('Crafting');
        this.game.scene.run('GameScene');
    }
}