import Phaser from 'phaser'
import Inventory from '../Components/Inventory'
import Item from '../Entities/Item'
import TeleportStone from '../Entities/TeleportStone'
import InventoryBase from './InventoryBase'

export default class InventoryUi extends InventoryBase {
    

    private keyI: Phaser.Input.Keyboard.Key

    constructor() {
        super('Inventory')
    }

    addElement(item: Item): void {
        super.addElement(item)

        this.container.add(item.sprite)
        item.sprite.setScrollFactor(0)
        if (item.sprite.texture.key !== 'teleport-stone')
            this.addItemInfo(item.sprite, item.effect)
        else
            this.addTeleportInfo(item as TeleportStone)

        this.setupItem(item)
        this.container.updatePosition()
    }

    preload() {
        super.preload()
        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)

        this.keyI.on(Phaser.Input.Keyboard.Events.DOWN, () => {
            this.scene.setVisible(false)
            this.scene.pause(this.scene.key)
            this.game.events.emit(InventoryUi.InventoryClosed)
        })
    }

   
}