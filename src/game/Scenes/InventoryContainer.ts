
import Phaser from 'phaser'
import { Item } from '../Entities/Item'
import InventoryBase from './InventoryBase'

const margin = 10
const offset = 24
const marginBetweenTwoElements = 16

const TextConfig = { fontFamily: 'pixellari', padding: { bottom: 3, left: 3 }, backgroundColor: '#111122' }

export default class InventoryContainer extends Phaser.GameObjects.Container {
    private readonly _maxRow: number = 5
    private readonly _itemInfo: Phaser.GameObjects.Text

    private _currentRow = 0
    private _height = 72

    constructor(scene: Phaser.Scene, x: number, y: number,
        private readonly _background: Phaser.GameObjects.GameObject,
        private readonly _title: Phaser.GameObjects.GameObject, ...children: Phaser.GameObjects.GameObject[]) {
            
        super(scene, x, y, children)

        const { events } = this.scene.game

        this.scene.add.existing(this)
        this._itemInfo = this.scene.add.text(0, 0, '', TextConfig)

        events.on(InventoryBase.INVENTORY_CLOSED, () => this._itemInfo.setVisible(false))
    }

    private buildInventorySlot(child: Phaser.GameObjects.GameObject) {
        if (child != this._background && child != this._title) {
            const ch = child as Phaser.GameObjects.Sprite
            ch.x = margin + offset * this._currentRow
            ch.y = this._height
            ++this._currentRow

            if (this._currentRow === this._maxRow) {
                this._height += 16
                this._currentRow = 0
            }
        } else if (child === this._title)
            this._height += marginBetweenTwoElements
    }

    updatePosition() {
        this._currentRow = 0
        this._height = 72

        this.each(this.buildInventorySlot, this)
    }

    deleteChild(child: string) {
        this.each((ch: Phaser.GameObjects.Image) => { if (ch.name === child) this.remove(ch) })
        this.updatePosition()
        this._itemInfo.text = ''
    }

    private showInfo(item: Phaser.GameObjects.Image) {
        const itemState = item.data.get(InventoryBase.DATA_ITEM_KEY) as Item

        this._itemInfo.setText(`${itemState.name}\n${itemState.description ? itemState.description : '????'}`)
        this._itemInfo.setPosition(item.x, item.y)
        this._itemInfo.setVisible(true)
    }

    addItemInfo(item: Phaser.GameObjects.Image): void {
        item.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => this.showInfo(item))

        item.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => this._itemInfo.setVisible(false))
    }
}