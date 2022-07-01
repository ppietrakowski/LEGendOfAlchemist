
import Character from '../Entities/Character'
import Item from './../Entities/Item'
import Component from './Component'


export default class Inventory extends Phaser.Events.EventEmitter implements Component {
    private items: Item[]
    private owner: Character
    hasItemsUpdate: boolean = false
   
    /*
     * Inventory event handlers name
     */
    static readonly InventoryFull = "InventoryFull"
    static readonly AddedItem = "AddedItem"
    static readonly InventoryStart = "InventoryStart"
    static readonly DeletedItem = "DeletedItem"

    constructor() {
        super()
    }

    getName(): string {
        return 'inventory'
    }

    get currentOwner(): Character { return this.owner }

    start(character: Character): void {
        this.owner = character
        this.items = []

        character.scene.game.events.emit(Inventory.InventoryStart, { inventory: this, owner: this.owner })
    }

    getItem(index: number): Item {
        return this.items[index]
    }

    hasItem(name: string): boolean { return this.items.findIndex(value => value.sprite.name === name) != -1 }

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
            if (this.items[i] === item && item.sprite.texture.key !== 'teleport-stone')
                this.removeItem(item, i)
        }
        this.hasItemsUpdate = true
    }

    update(_timeSinceLastFrame: number): void {
    }

    private removeItem(item: Item, i: number): void {
        this.emit(Inventory.DeletedItem, item)
        this.items.splice(i, 1)
    }
}