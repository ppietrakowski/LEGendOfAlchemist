import Phaser from 'phaser'

import Effect from '../Components/Effect'

import Character from './Character';

export default abstract class Item {
    effect: Effect;
    name: string;
    sprite: Phaser.GameObjects.Sprite;

    constructor(effect: Effect, sprite: Phaser.GameObjects.Sprite) {
        this.effect = effect;
        this.sprite = sprite;
        sprite.setInteractive({pixelPerfect: true})
    }

    abstract onUse(character: Character): void;
}
