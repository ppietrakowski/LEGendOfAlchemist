import Phaser from 'phaser'
import { Item, ItemContainer } from './../Entities/Item'

export default class ItemSlot {
    
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

        if (this.count <= 0) {
            this.events.emit(ItemSlot.ITEM_NOT_IN_SLOT, this.item)
            this.events.removeAllListeners()
        }
    }
}