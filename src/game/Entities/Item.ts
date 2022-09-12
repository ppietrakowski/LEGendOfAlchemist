import {Effect} from '../Components/Effects/Effect'
import GameObject from './GameObject'


export interface UsedCallback {
    (item: Item, gameObject: GameObject): void;
}

export interface Item {

    name: string;
    imageKey: string;
    description?: string | null;

    used?: UsedCallback;
    firstTimeUsed?: boolean;
    
    effect?: Effect;
}


export interface ItemContainer {
    events: Phaser.Events.EventEmitter;
    readonly owner: GameObject;

    getItem(index: number): Item;
    hasItem(name: string): boolean;
    addItem(item: Item): void;
    hasFreeSpace(): boolean;
    deleteItem(item: Item): void;
}   