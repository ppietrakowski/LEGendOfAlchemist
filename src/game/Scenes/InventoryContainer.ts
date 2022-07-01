
import Phaser from 'phaser'
import Effect from '../Components/Effect'
import TeleportStone from '../Entities/TeleportStone'
import InventoryBase from './InventoryBase'
import InventoryUi from './InventoryUi'

export default class InventoryContainer extends Phaser.GameObjects.Container {

    private readonly maxRow: number = 5
    private itemInfo: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, x: number, y: number,
            private readonly background: Phaser.GameObjects.GameObject,
            private readonly title: Phaser.GameObjects.GameObject, ...children: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y, children)

        this.scene.add.existing(this)
        this.itemInfo = this.scene.add.text(0, 0, '',  { fontFamily: 'pixellari', padding: { bottom: 3, left: 3 }, backgroundColor: '#111122' })
        this.scene.game.events.on(InventoryBase.InventoryClosed, () => this.itemInfo.setVisible(false))
    }

    public updatePosition() {
        let currentRow = 0
        let heigth = 72
        const margin = 10
        const offset = 24
        const marginBetweenTwoElements = 16

        this.each((child: Phaser.GameObjects.GameObject) => {
            if (child != this.background && child != this.title) {
                let ch = child as Phaser.GameObjects.Sprite
                ch.x = margin + offset * currentRow
                ch.y = heigth
                ++currentRow
                if (currentRow === this.maxRow) {
                    heigth += 16
                    currentRow = 0
                }
            } else if (child === this.title)
                heigth += marginBetweenTwoElements
        })
    }

    public deleteChild(child: string) {
        this.each((ch: Phaser.GameObjects.Sprite) => { if (ch.name === child) this.remove(ch); })
        this.updatePosition()
        this.itemInfo.text = ''
    }

    public addItemInfo(sprite: Phaser.GameObjects.Sprite, effect: Effect): void {
        sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
            this.itemInfo.setText(`hp: ${effect.deltaHp}\nstr: ${effect.deltaStrength}\nwis: ${effect.deltaWisdom}`)
            this.itemInfo.setPosition(sprite.x, sprite.y)
            this.itemInfo.setVisible(true)
        })

        sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            this.itemInfo.setVisible(false)
        })
    }

    public addTeleportInfo(teleport: TeleportStone): void {
        teleport.sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {

            this.itemInfo.setText(`Allows for teleport\nin teleport number ${teleport.index}`)
            this.itemInfo.setPosition(teleport.sprite.x, teleport.sprite.y)
            this.itemInfo.setVisible(true)
        })

        teleport.sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            this.itemInfo.setVisible(false)
        })
    }
}