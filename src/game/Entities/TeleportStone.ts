import Effect from "../Components/Effect"
import GameObject from "./GameObject"
import {IItem, Item, UsedCallback} from "./Item"


export default class TeleportStone implements IItem {
    name: string
    used?: UsedCallback
    description?: string

    constructor(public imageKey: string, public index: number) {

        this.name = `TeleportStone0${index}`
        this.used = this.beenUsed.bind(this)
        
        this.description = 'Is used to teleport'
    }
    
    private beenUsed(item: IItem, gameObject: GameObject) {
    }
}