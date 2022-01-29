import Phaser from 'phaser'

import InventoryBase from './InventoryBase';

import Character from '../Entities/Character'
import Item from '../Entities/Item';

import Inventory from '../Components/Inventory'


export default class InventoryUi extends InventoryBase {
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

    addElement(item: Item): void {
        this.container.add(item.sprite);
        item.sprite.setScrollFactor(0);
        if (item.sprite.texture.key !== 'teleport-stone') {
            this.addItemInfo(item.sprite, item.effect);
        }
        this.updatePosition();
    }

    preload() {
        super.preload();
        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    }

    update(time: number, delta: number): void {
        if (this.keyI.isDown) {
            this.game.scene.game.scene.pause('Inventory');
            this.scene.setVisible(false);
            this.game.scene.game.scene.run('GameScene');
        }
    }
}