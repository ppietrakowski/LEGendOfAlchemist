
import GameObject from '../Entities/GameObject'
import { Item } from './../Entities/Item'
import { Component } from './Component'


export interface InventoryStartEvent {
    inventory: Inventory,
    owner: GameObject
}

class ItemSlot {

    private _count: number
    events: Phaser.Events.EventEmitter

    static readonly ITEM_NOT_IN_SLOT = 'itemNotInSlot'

    constructor(public readonly item: Item) {
        this._count = 1
        this.events = new Phaser.Events.EventEmitter()
    }

    get count() {
        return this._count
    }

    addItemToSlot() {
        this._count++
    }


    removeItemFromSlot() {
        this._count--

        if (this.count <= 0)
            this.events.emit(ItemSlot.ITEM_NOT_IN_SLOT, this.item)
    }

}

export class Inventory extends Phaser.Events.EventEmitter implements Component {
    private items: ItemSlot[]

    /*
     * Inventory event handlers name
     */
    static readonly INVENTORY_FULL = "InventoryFull"
    static readonly ADDED_ITEM = "AddedItem"
    static readonly DELETED_ITEM = "DeletedItem"
    static readonly INVENTORY_NEED_UPDATE = "InventoryNeedUpdate"

    static readonly COMPONENT_NAME = 'inventory'

    constructor(public readonly owner: GameObject) {
        super()

        this.items = []
    }

    destroy(): void {
        this.items = null
        super.destroy()
    }

    getName(): string {
        return Inventory.COMPONENT_NAME;
    }

    getItem(index: number): Item {
        return this.items[index].item
    }

    hasItem(name: string): boolean {
        return this.items.findIndex(value => value.item.name === name) != -1
    }

    addItem(item: Item) {

        if (this.hasFreeSpace())
            this.addOnFreeSpace(item)
        else
            this.emit(Inventory.INVENTORY_FULL)
    }

    hasFreeSpace(): boolean {
        return this.items.length < 25
    }

    deleteItem(item: Item) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].item === item) {
                this.items[i].removeItemFromSlot()
            }
        }

        this.emit(Inventory.INVENTORY_NEED_UPDATE, item.name)
    }

    private addOnFreeSpace(item: Item) {
        if (!this.hasItem(item.name)) 
            this.createNewItem(item)
        else
            this.addExistingItem(item)
    }

    private createNewItem(item: Item) {
        let slot = new ItemSlot(item)
        this.emit(Inventory.ADDED_ITEM, item)
        this.items.push(slot)

        slot.events.on(ItemSlot.ITEM_NOT_IN_SLOT, this.removeItem, this)
    }

    private addExistingItem(item: Item) {
        let itemState = this.items.find(v => v.item === item)
        itemState.addItemToSlot()
    }

    private removeItem(item: Item): void {
        this.emit(Inventory.DELETED_ITEM, item)
        this.items = this.items.filter(value => value.item !== item)
    }
}