import Phaser from "phaser"
import Effect from "../Components/Effect"
import Inventory from '../Components/Inventory'
import Item from "../Entities/Item"
import TeleportStone from "../Entities/TeleportStone"

export default abstract class InventoryBase extends Phaser.Scene {
    inventory: Inventory
    background: Phaser.GameObjects.Sprite
    container: Phaser.GameObjects.Container
    maxRow: number = 5
    title: Phaser.GameObjects.Text
    keyI: Phaser.Input.Keyboard.Key
    itemInfo: Phaser.GameObjects.Text

    constructor(name: string) {
        super(name)
        this.inventory = null
    }

    abstract addElement(item: Item): void

    deleteChild(child: string): void {
        this.container.each((ch: Phaser.GameObjects.Sprite) => { if (ch.name === child) this.container.remove(ch); })
        this.itemInfo.setText('')
        this.updatePosition()
    }

    preload(): void {
        this.container = this.add.container(50, 60)
        this.container.setScrollFactor(0)

        this.background = this.add.sprite(0, 60, 'inventory-background').setOrigin(0, 0)
        this.container.add(this.background)

        this.title = this.add.text(20, 60, 'Inventory', { fontFamily: 'pixellari' })
        this.container.add(this.title)
        this.itemInfo = this.add.text(0, 0, '', { fontFamily: 'pixellari', padding: { bottom: 3, left: 3 }, backgroundColor: '#111122' })
    }

    updatePosition() {
        let currentRow = 0
        let heigth = 72
        const margin = 10
        const offset = 24
        const marginBetweenTwoElements = 16

        this.container.each((child: Phaser.GameObjects.GameObject) => {
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

        this.inventory.hasItemsUpdate = false
    }

    addItemInfo(sprite: Phaser.GameObjects.Sprite, effect: Effect): void {
        sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
            this.itemInfo.setText(`hp: ${effect.deltaHp}\nstr: ${effect.deltaStrength}\nwis: ${effect.deltaWisdom}`)
            this.itemInfo.setPosition(sprite.x, sprite.y)
            this.itemInfo.setVisible(true)
        })

        sprite.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            this.itemInfo.setVisible(false)
        })
    }

    addTeleportInfo(teleport: TeleportStone): void {
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