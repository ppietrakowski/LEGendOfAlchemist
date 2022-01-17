import Phaser from 'phaser'
import Effect from '../Components/Effect'
import Character from './Character';

export default abstract class Item {
    effect: Effect;
    name: string;
    sprite: Phaser.Physics.Arcade.Sprite;

    constructor(effect: Effect, sprite: Phaser.Physics.Arcade.Sprite) {
        this.effect = effect;
        this.sprite = sprite;
    }

    abstract onUse(character: Character): void;
}
