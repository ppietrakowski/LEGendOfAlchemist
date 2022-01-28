import Phaser from 'phaser';
import Inventory from '../Components/Inventory';
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
    inventory: Inventory;
    background: Phaser.GameObjects.Sprite;
    container: Phaser.GameObjects.Container;
    maxRow: number = 5;
    title: Phaser.GameObjects.Text;
    keyI: Phaser.Input.Keyboard.Key;
    
    constructor() {
        super('Crafting');
    }

    preload(): void {
        this.items = []
        this.container = this.add.container(50, 60);
        this.container.setScrollFactor(0);

        this.background = this.add.sprite(0, 60, 'inventory-background').setOrigin(0, 0);
        this.container.add(this.background);

        this.title = this.add.text(20, 60, 'Inventory');
        this.container.add(this.title);
        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    }

    create(): void {
        for (let i = 0; i < MaxItemsForCraft; i++) {
            let field = new Field(null, this.add.image(500 + i * 48, 120, 'item-background').setOrigin(0, 0));
            field.backgroundImage.setInteractive({dropZone: true, pixelPerfect: true});
            field.backgroundImage.scaleX = 2;
            field.backgroundImage.scaleY = 2;
            field.backgroundImage.name = "item-bkg-" + i;
            field.backgroundImage.setScrollFactor(0);
            
            this.items.push(field)
        }

        this.input.on(Phaser.Input.Events.DRAG, (pointer: Phaser.Input.Pointer, gameobject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
            gameobject.x = dragX;
            gameobject.y = dragY;
        });

        this.craft = new Button(this, 430, 430, 'craft-item', () => { this.onCraft() });
    }

    update(time: number, delta: number): void {
    }

    addElement(item: Item): void {
        var sprite = this.add.sprite(item.sprite.x, item.sprite.y, item.sprite.texture.key);
        sprite.name = item.sprite.name;

        sprite.setInteractive({pixelPerfect: true, draggable: true});
        
        sprite.on(Phaser.Input.Events.DROP, (pointer: Phaser.Input.Pointer, dropZone: Phaser.GameObjects.Image) => {
            console.log(dropZone.name.startsWith('item-bkg-'));
            if (dropZone.name.startsWith('item-bkg-')) {
                var i = dropZone.getTopLeft()
                sprite.setPosition(i.x + sprite.width / 2, i.y);
                this.items.find((v) => v.backgroundImage.name === dropZone.name).item = item;
                console.log(this.items);
            }
        })

        this.container.add(sprite);
        sprite.setScrollFactor(0);
        this.updatePosition();
    }
    
    updatePosition() {
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

    deleteChild(child: string): void {
        this.container.each((ch: Phaser.GameObjects.Sprite) => { 
            if (ch.name == child) {
                this.container.remove(ch); 
                ch.destroy();
            }});
        this.updatePosition();
    }
    

    getField(bkgname: String): Field {
        for (let i of this.items) {
            if (i.backgroundImage.name === bkgname)
                return i;
        }
        return null;
    }


    onCraft(): void {

        // for now just get back to gamescene
        this.game.scene.pause('Crafting', () => {
            // disable all items
            for (let item of this.items)
                item.item = null;
            this.updatePosition();
        });

        this.scene.setVisible(false);
        this.game.scene.run('GameScene');
    }
}