import Phaser from 'phaser';
import Effect from '../Components/Effect';
import Inventory from '../Components/Inventory';
import Button from '../Entities/Button';
import Item from '../Entities/Item';
import InventoryBase from './InventoryBase';
import Potion from '../Entities/Potion'

class Field {
    item: Item
    backgroundImage: Phaser.GameObjects.Image

    constructor(item: Item, backgroundImage: Phaser.GameObjects.Image) {
        this.item = item;
        this.backgroundImage = backgroundImage;
    }
}

const MaxItemsForCraft = 4;

export default class Crafting extends InventoryBase {
    items: Array<Field>
    craft: Button
    
    constructor() {
        super('Crafting');
    }

    preload(): void {
        super.preload();
        this.items = []       
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
            if (dropZone.name.startsWith('item-bkg-') && !this.items.find((v) => v.backgroundImage.name === dropZone.name).item) {
                var i = dropZone.getTopLeft()
                sprite.setPosition(i.x + sprite.width / 2, i.y);
                this.items.find((v) => v.backgroundImage.name === dropZone.name).item = item;
            }
        })

        this.container.add(sprite);
        sprite.setScrollFactor(0);
        this.updatePosition();
    }
    
    deleteChild(child: string): void {
        super.deleteChild(child);
        this.scene.scene.children.getByName(child).destroy();
        this.updatePosition();
    }
    
    getField(bkgname: String): Field {
        for (let i of this.items) {
            if (i.backgroundImage.name === bkgname)
                return i;
        }
        return null;
    }


    mixEffects(): Effect {
        let effect = new Effect(0, 0, 0, Math.round(Math.random() * (4 - 1) + 1));

        for (let item of this.items) {
            if (item.item != null)
                this.sumEffect(effect, item.item.effect);
        }

        return effect;
    }

    sumEffect(effect: Effect, itemEffect: Effect): void {
        effect.deltaHp += itemEffect.deltaHp;
        effect.deltaStrength += itemEffect.deltaStrength;
        effect.deltaWisdom += itemEffect.deltaWisdom;
    }

    hasAnyItemInArray(): boolean {
        let anyItem = false;
        for (let item of this.items) {
            if (item.item != null) {
                anyItem = true;
                break;
            }
        }

        return anyItem;
    }

    onCraft(): void {

        if (this.hasAnyItemInArray()) {
            let mixture = new Potion(this.mixEffects(), this.add.sprite(0, 0, 'potion'));
            this.inventory.addItem(mixture);

            // delete rest of items
            for (let item of this.items) {
                if (item.item != null) {
                    this.inventory.deleteItem(item.item);
                }
            }
        }


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