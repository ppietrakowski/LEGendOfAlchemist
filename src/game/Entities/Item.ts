import Effect from '../Components/Effect'
import GameObject from './GameObject'


export interface UsedCallback {
    (item: Item, gameObject: GameObject): void
}

export interface Item {

    name: string
    imageKey: string
    description?: string
    
    used?: UsedCallback
    
    effect?: Effect
}
