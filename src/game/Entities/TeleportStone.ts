import {Item, UsedCallback} from "./Item"


export default class TeleportStone implements Item {
    name: string
    used?: UsedCallback
    description?: string

    constructor(public imageKey: string, public index: number) {

        this.name = `TeleportStone0${index}`
        this.used = undefined
        
        this.description = 'Is used to teleport'
    }
}