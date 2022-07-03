
import Character from '../Entities/Character'
import Item from './../Entities/Item'
import Component from './Component'

export interface InventoryStartEvent {
    inventory: Inventory,
    owner: Character
}

export class Inventory extends Phaser.Events.EventEmitter implements Component {
    private items: Item[]
   
    /*
     * Inventory event handlers name
     */
    static readonly InventoryFull = "InventoryFull"
    static readonly AddedItem = "AddedItem"
    static readonly InventoryStart = "InventoryStart"
    static readonly DeletedItem = "DeletedItem"
    static readonly InventoryNeedUpdate = "InventoryNeedUpdate"

    constructor(private readonly owner: Character) {
        super()

        this.items = []
        owner.scene.game.events.emit(Inventory.InventoryStart, { inventory: this, owner: this.owner })
    }

    getName(): string {
        return 'inventory'
    }

    get currentOwner(): Character { return this.owner }

    getItem(index: number): Item {
        return this.items[index]
    }

    hasItem(name: string): boolean { return this.items.findIndex(value => value.image.name === name) != -1 }

    addItem(item: Item) {

        if (this.hasFreeSpace())
            this.addOnFreeSpace(item)
        else
            this.emit(Inventory.InventoryFull)
    }

    private addOnFreeSpace(item: Item) {
        this.items.push(item)
        this.emit(Inventory.AddedItem, item)
    }

    hasFreeSpace(): boolean {
        return this.items.length < 25
    }

    deleteItem(item: Item) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] === item && item.image.texture.key !== 'teleport-stone')
                this.removeItem(item, i)
        }
        
        this.emit(Inventory.InventoryNeedUpdate, item.name)
    }

    private removeItem(item: Item, i: number): void {
        this.emit(Inventory.DeletedItem, item)
        this.items.splice(i, 1)
    }
}