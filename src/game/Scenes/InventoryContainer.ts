
import Phaser from 'phaser'
import Effect from '../Components/Effect'
import TeleportStone from '../Entities/TeleportStone'
import InventoryBase from './InventoryBase'

const margin = 10
const offset = 24
const marginBetweenTwoElements = 16

export default class InventoryContainer extends Phaser.GameObjects.Container {
    private readonly maxRow: number = 5
    private readonly itemInfo: Phaser.GameObjects.Text

    private currentRow = 0
    private heigth = 72

    constructor(scene: Phaser.Scene, x: number, y: number,
        private readonly background: Phaser.GameObjects.GameObject,
        private readonly title: Phaser.GameObjects.GameObject, ...children: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y, children)

        this.scene.add.existing(this)
        this.itemInfo = this.scene.add.text(0, 0, '', { fontFamily: 'pixellari', padding: { bottom: 3, left: 3 }, backgroundColor: '#111122' })
        this.scene.game.events.on(InventoryBase.INVENTORY_CLOSED, () => this.itemInfo.setVisible(false))
    }

    public updatePosition() {
        this.currentRow = 0
        this.heigth = 72

        this.each(this.buildInventorySlot, this)
    }

    public deleteChild(child: string) {
        this.each((ch: Phaser.GameObjects.Sprite) => { if (ch.name === child) this.remove(ch); })
        this.updatePosition()
        this.itemInfo.text = ''
    }

    public addItemInfo(image: Phaser.GameObjects.Image, effect: Effect): void {
        image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
            this.itemInfo.setText(`hp: ${effect.deltaHp}\nstr: ${effect.deltaStrength}\nwis: ${effect.deltaWisdom}`)
            this.itemInfo.setPosition(image.x, image.y)
            this.itemInfo.setVisible(true)
        })

        image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            this.itemInfo.setVisible(false)
        })
    }

    public addTeleportInfo(teleport: TeleportStone): void {
        teleport.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {

            this.itemInfo.setText(`Allows for teleport\nin teleport number ${teleport.index}`)
            this.itemInfo.setPosition(teleport.image.x, teleport.image.y)
            this.itemInfo.setVisible(true)
        })

        teleport.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            this.itemInfo.setVisible(false)
        })
    }

    private buildInventorySlot(child: Phaser.GameObjects.GameObject) {
        if (child != this.background && child != this.title) {
            let ch = child as Phaser.GameObjects.Sprite
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
}