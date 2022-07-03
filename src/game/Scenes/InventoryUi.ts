import Phaser from 'phaser'
import Item from '../Entities/Item'
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

    protected addElement(item: Item): void {
        super.addElement(item)

        this.container.add(item.image)
        item.image.setScrollFactor(0)

        if (item.image.texture.key !== 'teleport-stone')
            this.container.addItemInfo(item.image, item.effect)
        else
            this.container.addTeleportInfo(item as TeleportStone)

        this.setupItem(item)
        this.container.updatePosition()
    }
}