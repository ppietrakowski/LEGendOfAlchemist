
import GameObject from '../Entities/GameObject'
import { Item, ItemContainer } from './../Entities/Item'
import { Component } from './Component'
import ItemSlot from './ItemSlot'

export interface InventoryStartEvent {
    inventory: ItemContainer,
    owner: GameObject
}

export class Inventory implements Component, ItemContainer {
    private _items: ItemSlot[]

    events: Phaser.Events.EventEmitter
    /*
     * Inventory event handlers name
     */
    static readonly INVENTORY_FULL = Symbol('InventoryFull')
    static readonly ADDED_ITEM = Symbol('AddedItem')
    static readonly DELETED_ITEM = Symbol('DeletedItem')
    static readonly INVENTORY_NEED_UPDATE = Symbol('InventoryNeedUpdate')

    static readonly COMPONENT_NAME = 'inventory'

    constructor(public readonly owner: GameObject) {
        this._items = []
        this.events = new Phaser.Events.EventEmitter()
    }
    
    destroy(): void {
        this._items = null
        this.events.destroy()
    }

    getName(): string {
        return Inventory.COMPONENT_NAME
    }

    getItem(index: number): Item {
        return this._items[index].item
    }

    hasItem(name: string): boolean {
        return this._items.findIndex(value => value.item.name === name) != -1
    }

    private removeItem(item: Item): void {
        this.events.emit(Inventory.DELETED_ITEM, item)
        this._items = this._items.filter(value => value.item !== item)
    }

    private createNewItem(item: Item) {
        const slot = new ItemSlot(item)
        this.events.emit(Inventory.ADDED_ITEM, item)
        this._items.push(slot)

        slot.events.on(ItemSlot.ITEM_NOT_IN_SLOT, this.removeItem, this)
    }

    private addExistingItem(item: Item) {
        const itemState = this._items.find(v => v.item === item)
        itemState.addItemToSlot()
    }

    private addOnFreeSpace(item: Item) {
        if (!this.hasItem(item.name))
            this.createNewItem(item)
        else
            this.addExistingItem(item)
    }

    addItem(item: Item) {
        if (this.hasFreeSpace())
            this.addOnFreeSpace(item)
        else
            this.events.emit(Inventory.INVENTORY_FULL)
    }

    hasFreeSpace(): boolean {
        return this._items.length < 25
    }

    deleteItem(item: Item) {
        for (let i = 0; i < this._items.length; i++) {
            if (this._items[i].item === item) {
                this._items[i].removeItemFromSlot()
            }
        }

        this.events.emit(Inventory.INVENTORY_NEED_UPDATE, item.name)
    }
}