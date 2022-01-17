import Phaser from 'phaser'
import Effect from '../Components/Effect'
import Character from './Character';

export default abstract class Item {
    effect: Effect;
    name: string;

    constructor(effect: Effect) {
        this.effect = effect;
    }

    abstract onUse(character: Character): void;
}
