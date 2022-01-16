import Phaser from 'phaser'

import Character from './Character'
import Player from './Player';

import EnemyController from '../Components/EnemyController';
import HealthBar from '../Components/HealthBar';

export default class Enemy extends Character {
    name: string;

    constructor(name: string, maxRange: number, sprite: Phaser.Physics.Arcade.Sprite, player: Player) {
        super(sprite);
        this.name = name;
        this.start(sprite.scene);
        this.addComponent(new EnemyController(player, maxRange));
        this.addComponent(new HealthBar(player, 100));
    }

    start(scene: Phaser.Scene): void {
    }

    makeDead(): void {
        
        this.getComponent<HealthBar>('hp-bar').hide();
        
        this.sprite.destroy();
    }
}