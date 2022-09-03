
import Phaser from 'phaser'
import { Item } from '../Entities/Item'
import InventoryBase from './InventoryBase'

const margin = 10
const offset = 24
const marginBetweenTwoElements = 16

const TextConfig = { fontFamily: 'pixellari', padding: { bottom: 3, left: 3 }, backgroundColor: '#111122' };

export default class InventoryContainer extends Phaser.GameObjects.Container {
    private readonly maxRow: number = 5
    private readonly itemInfo: Phaser.GameObjects.Text

    private currentRow = 0
    private heigth = 72

    constructor(scene: Phaser.Scene, x: number, y: number,
        private readonly background: Phaser.GameObjects.GameObject,
        private readonly title: Phaser.GameObjects.GameObject, ...children: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y, children)

        let { events } = this.scene.game

        this.scene.add.existing(this)
        this.itemInfo = this.scene.add.text(0, 0, '', TextConfig)

        events.on(InventoryBase.INVENTORY_CLOSED, () => this.itemInfo.setVisible(false))
    }

    private buildInventorySlot(child: Phaser.GameObjects.GameObject) {
        if (child != this.background && child != this.title) {
            const ch = child as Phaser.GameObjects.Sprite
            ch.x = margin + offset * this.currentRow
            ch.y = this.heigth
            ++this.currentRow

            if (this.currentRow === this.maxRow) {
                this.heigth += 16
                this.currentRow = 0
            }
        } else if (child === this.title)
            this.heigth += marginBetweenTwoElements
    }

    updatePosition() {
        this.currentRow = 0
        this.heigth = 72

        this.each(this.buildInventorySlot, this)
    }

    deleteChild(child: string) {
        this.each((ch: Phaser.GameObjects.Image) => { if (ch.name === child) this.remove(ch); })
        this.updatePosition()
        this.itemInfo.text = ''
    }

    private showInfo(item: Phaser.GameObjects.Image) {
        let itemState = item.data.get(InventoryBase.DATA_ITEM_KEY) as Item

        this.itemInfo.setText(`${itemState.name}\n${itemState.description ? itemState.description : '????'}`)
        this.itemInfo.setPosition(item.x, item.y)
        this.itemInfo.setVisible(true)
    }

    addItemInfo(item: Phaser.GameObjects.Image): void {
        item.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => this.showInfo(item))

        item.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => this.itemInfo.setVisible(false))
    }
}