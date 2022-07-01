
import Character from '../Entities/Character'
import Player from '../Entities/Player'
import Crafting from '../Scenes/Crafting'
import InventoryUi from '../Scenes/InventoryUi'
import { addInformationText } from '../Scenes/SceneUtils'
import Item from './../Entities/Item'
import Component from './Component'


export default class Inventory implements Component {
    items: Item[]
    owner: Character
    hasItemsUpdate: boolean = false
    keyI: Phaser.Input.Keyboard.Key

    getName(): string {
        return 'inventory'
    }

    start(character: Character): void {
        let { keyboard } = character.scene.input

        this.owner = character
        this.items = []

        this.keyI = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)
        this.keyI.on(Phaser.Input.Keyboard.Events.DOWN, () => {
            this.ui.game.scene.game.scene.run('Inventory')
            this.ui.scene.setVisible(true)
            this.ui.game.scene.game.scene.pause('GameScene')
        })

        // use this as inventory when clicked I and when crafting
        this.ui.inventory = this
        this.crafting.inventory = this
    }

    getItem(index: number): Item {
        return this.items[index]
    }

    addItem(item: Item) {

        if (this.hasFreeSpace())
            this.addOnFreeSpace(item)
        else
            this.showCannotGatherInfo()
    }

    showCannotGatherInfo(): void {
        let { scene } = this.owner
        addInformationText(scene, this.owner.x, this.owner.y, 'I don\'t have enough space to gather this item', (text: Phaser.GameObjects.GameObject) => text.destroy())
    }

    private addOnFreeSpace(item: Item) {
        this.items.push(item)

        let sprite = this.ui.add.sprite(item.sprite.x, item.sprite.y, item.sprite.texture.key)
        item.sprite.destroy()

        item.sprite = sprite
        this.setupItem(item)

        item.sprite.name = sprite.texture.key + "-" + Math.round(sprite.x) + "-" + Math.round(sprite.y)

        this.crafting.addElement(item)
        this.ui.addElement(item)
    }

    hasFreeSpace(): boolean {
        return this.items.length < 25
    }

    deleteItem(item: Item) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] === item && item.sprite.texture.key !== 'teleport-stone')
                this.removeItem(item, i)
        }
        this.hasItemsUpdate = true
    }

    update(_timeSinceLastFrame: number): void {
    }

    get ui(): InventoryUi {
        return (this.owner.scene.game.scene.getScene('Inventory') as InventoryUi)
    }

    get crafting(): Crafting {
        return (this.owner.scene.game.scene.getScene('Crafting') as Crafting)
    }

    private removeItem(item: Item, i: number): void {
        this.crafting.deleteChild(item.sprite.name)
        this.ui.deleteChild(item.sprite.name)
        item.sprite.destroy()
        this.items.splice(i, 1)
    }

    private setupItem(item: Item): void {
        if (item.sprite.texture.key !== 'teleport-stone') {
            item.sprite.once(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                item.onUse(this.owner);
                (this.owner as Player).inventory.deleteItem(item)
            });
        }

        item.sprite.setInteractive({ pixelPerfect: true })
    }
}