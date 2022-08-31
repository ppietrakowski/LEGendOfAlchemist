import Phaser from 'phaser'
import {IItem, Item} from '../Entities/Item'
import TeleportStone from '../Entities/TeleportStone'
import InventoryBase from './InventoryBase'

export default class InventoryUi extends InventoryBase {
    private keyI: Phaser.Input.Keyboard.Key

    constructor() {
        super('Inventory')
    }

    preload() {
        super.preload()
        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)

        this.keyI.on(Phaser.Input.Keyboard.Events.DOWN, () => {
            this.scene.setVisible(false)
            this.scene.pause(this.scene.key)
            this.game.events.emit(InventoryUi.INVENTORY_CLOSED)
        })
    }

    protected addElement(item: IItem): Phaser.GameObjects.Image {
        let image = super.addElement(item)

        this.container.add(image)
        image.setScrollFactor(0)

        this.setupItem(image)
        this.container.updatePosition()

        return image
    }
}