import Phaser from "phaser";
import Effect from "../Components/Effect";
import Inventory from '../Components/Inventory'
import Item from "../Entities/Item";

export default abstract class InventoryBase extends Phaser.Scene {
    inventory: Inventory;
    background: Phaser.GameObjects.Sprite;
    container: Phaser.GameObjects.Container;
    maxRow: number = 5;
    title: Phaser.GameObjects.Text;
    keyI: Phaser.Input.Keyboard.Key;
    itemInfo: Phaser.GameObjects.Text;

    constructor(name: string) {
        super(name);
        this.inventory = null;
    }

    abstract addElement(item: Item): void;

    deleteChild(child: string): void {
        this.container.each((ch: Phaser.GameObjects.Sprite) => { if (ch.name === child) this.container.remove(ch); });
        this.updatePosition();
    }

    preload(): void {
        this.container = this.add.container(50, 60);
        this.container.setScrollFactor(0);

        this.background = this.add.sprite(0, 60, 'inventory-background').setOrigin(0, 0);
        this.container.add(this.background);

        this.title = this.add.text(20, 60, 'Inventory', {fontFamily: 'pixellari'});
        this.container.add(this.title);
        this.itemInfo = this.add.text(0, 0, '', {fontFamily: 'pixellari', padding: {bottom: 3, left: 3}, backgroundColor: '#111122'  });
    }

    updatePosition() {
        let currentRow = 0;
        let heigth = 65;

        this.container.each((child: Phaser.GameObjects.GameObject) => {
            if (child != this.background && child != this.title) {
                let ch = child as Phaser.GameObjects.Sprite;
                ch.x = 10 + 24 * currentRow;
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

    addItemInfo(sprite: Phaser.GameObjects.Sprite, effect: Effect) {
        sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, (pointer, localX, localY, evt) => {
            this.itemInfo.setText(`hp: ${effect.deltaHp}\nstr: ${effect.deltaStrength}\nwis: ${effect.deltaWisdom}`);
            this.itemInfo.setPosition(sprite.x, sprite.y);
            this.itemInfo.setVisible(true);
        } );
        
        sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, (pointer, evt) => {
            this.itemInfo.setVisible(false);
        } );
    }

}