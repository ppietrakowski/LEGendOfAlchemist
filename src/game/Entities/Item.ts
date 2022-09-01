import Effect from '../Components/Effects/Effect'
import GameObject from './GameObject'


export interface UsedCallback {
    (item: Item, gameObject: GameObject): void
}

export interface Item {

    name: string
    imageKey: string
    description?: string
    
    used?: UsedCallback
    firstTimeUsed?: boolean
    
    effect?: Effect
}
