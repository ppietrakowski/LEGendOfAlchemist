import Phaser from "phaser";
import Character from "./Character";
import Component from "./Component";
import Enemy from "./Enemy";
import Player from './Player'

export default class EnemyController implements Component {
    target: Player;
    self: Enemy;

    constructor(target: Player) {
        this.target = target;
    }

    debugName(): string {
        return 'Enemy Movement';
    }

    getName(): string {
        return 'enemy-movement';
    }

    start(character: Character): void {
        this.self = character;
    }

    update(timeSinceLastFrame: number): void {
        
    }
}