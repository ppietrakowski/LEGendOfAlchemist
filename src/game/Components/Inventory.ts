
import GameObject from '../Entities/GameObject'
import { Item } from './../Entities/Item'
import { Component } from './Component'


export interface InventoryStartEvent {
    inventory: Inventory,
    owner: GameObject
}


export class Inventory extends Phaser.Events.EventEmitter implements Component {
    private items: Item[]

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
        return this.items[index]
    }

    hasItem(name: string): boolean {
        return this.items.findIndex(value => value.name === name) != -1
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
            if (this.items[i] === item)
                this.removeItem(item, i)
        }

        this.emit(Inventory.INVENTORY_NEED_UPDATE, item.name)
    }

    private addOnFreeSpace(item: Item) {
        this.items.push(item)
        this.emit(Inventory.ADDED_ITEM, item)
    }

    private removeItem(item: Item, i: number): void {
        this.emit(Inventory.DELETED_ITEM, item)
        this.items.splice(i, 1)
    }
}