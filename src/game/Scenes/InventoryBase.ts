import Phaser from "phaser"
import { Inventory, InventoryStartEvent } from '../Components/Inventory'
import {Item,  IItem } from "../Entities/Item"
import Player from "../Entities/Player"
import InventoryContainer from './InventoryContainer'

export default abstract class InventoryBase extends Phaser.Scene {
    protected inventory: Inventory
    protected container: InventoryContainer
    static readonly INVENTORY_CLOSED = "InventoryClosed"

    constructor(key: string) {
        super({ key })
    }

    preload(): void {
        this.container = new InventoryContainer(this, 50, 60, this.add.sprite(0, 60, 'inventory-background').setOrigin(0, 0), this.add.text(20, 60, 'Inventory', { fontFamily: 'pixellari' }))

        this.container.setScrollFactor(0)

        this.game.events.once(Player.INVENTORY_START, this.assignInventory, this)
    }

    protected setupItem(image: Phaser.GameObjects.Image): void {
        if (image.texture.key !== 'teleport-stone')
            this.makeItemUsableInInventory(image)

        image.setInteractive({ pixelPerfect: true })
    }

    protected addElement(item: IItem): Phaser.GameObjects.Image {
        const image = this.add.image(0, 0, item.imageKey)
        image.data.set('info', item)
        return image
    }

    private makeItemUsableInInventory(item: Phaser.GameObjects.Image) {
        const {owner} = this.inventory

        item.once(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            let inventory = owner.getComponent<Inventory>(Inventory.COMPONENT_NAME)
            let itemState = item.data.get('info') as IItem

            if (itemState.used)
                itemState.used(itemState, owner)

            inventory.deleteItem(itemState)
        });
    }

    private assignInventory(inventoryEvent: InventoryStartEvent) {
        this.inventory = inventoryEvent.inventory
        this.inventory.on(Inventory.ADDED_ITEM, this.addElement, this)
        this.inventory.on(Inventory.INVENTORY_FULL, () => console.log("Inventory full !"))
    }
}