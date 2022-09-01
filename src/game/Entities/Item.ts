import DamageInflictor from '../Components/DamageInflictor'
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
    firstTimeUsed?: boolean
    
    effect?: DamageInflictor
}
