import Phaser from "phaser"
import Effect from "../Components/Effect"
import Inventory from '../Components/Inventory'
import Character from "../Entities/Character"
import Item from "../Entities/Item"
import TeleportStone from "../Entities/TeleportStone"
import InventoryContainer from './InventoryContainer'

export default abstract class InventoryBase extends Phaser.Scene {
    protected inventory: Inventory
    protected container: InventoryContainer
    static readonly InventoryClosed = "InventoryClosed"
    
    constructor(key: string) {
        super({ key })
    }

    addElement(item: Item): void {
        let sprite = item.sprite
        item.sprite = this.add.sprite(item.sprite.x, item.sprite.y, item.sprite.texture.key)
        sprite.destroy()

        item.sprite.name = sprite.texture.key + "-" + Math.round(sprite.x) + "-" + Math.round(sprite.y)
    }

    deleteChild(child: string): void {
        this.container.deleteChild(child)
    }

    preload(): void {
        this.container = new InventoryContainer(this, 50, 60, this.add.sprite(0, 60, 'inventory-background').setOrigin(0, 0), this.add.text(20, 60, 'Inventory', { fontFamily: 'pixellari' }))

        this.container.setScrollFactor(0)

        this.game.events.on(Inventory.InventoryStart, this.assignInventory, this)
    }

    private assignInventory(inventoryEvent: { inventory: Inventory, owner: Character }) {

        if (inventoryEvent.owner.name === 'player') {
            this.inventory = inventoryEvent.inventory
            this.inventory.on(Inventory.AddedItem, this.addElement, this)
            this.inventory.on(Inventory.InventoryFull, () => console.log("Inventory full !"))
            this.game.events.off(Inventory.InventoryStart, this.assignInventory)
        }
    }

    protected addItemInfo(sprite: Phaser.GameObjects.Sprite, effect: Effect): void {
        this.container.addItemInfo(sprite, effect)
    }

    protected addTeleportInfo(teleport: TeleportStone): void {
        this.container.addTeleportInfo(teleport)
    }

    protected setupItem(item: Item): void {
        let owner = this.inventory.currentOwner

        if (item.sprite.texture.key !== 'teleport-stone') {
            item.sprite.once(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                let inventory = owner.getComponent<Inventory>('inventory')

                item.used(owner)
                inventory.deleteItem(item)
            });
        }

        item.sprite.setInteractive({ pixelPerfect: true })
    }
}