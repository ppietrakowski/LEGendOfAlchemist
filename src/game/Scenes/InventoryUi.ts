import Phaser from 'phaser'
import InventoryBase from './InventoryBase'

export default class InventoryUi extends InventoryBase {
    private _keyI: Phaser.Input.Keyboard.Key

    constructor() {
        super('Inventory')
    }

    preload() {
        super.preload()
        this._keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)

        this._keyI.on(Phaser.Input.Keyboard.Events.DOWN, this.switchToGame, this)
    }

    switchToGame() {
        this.scene.setVisible(false)
        this.scene.pause(this.scene.key)
        this.game.events.emit(InventoryUi.INVENTORY_CLOSED)
    }
}