import Character from "./Character";
import PlayerMovement from './PlayerMovement'
import Attribute from './Attribute'

export default class Player extends Character {
    
    constructor(sprite: Phaser.Physics.Arcade.Sprite) {
        super(sprite);
        this.addComponent(new PlayerMovement());
        sprite.setScrollFactor(0);
        this.addComponent(new Attribute(100, 50, 10));
    }

    start(): void {
        
    }

    makeDead(): void {
        
    }

    isDead(): boolean {
        return !this.getComponent<Attribute>('attributes').isAlive();
    }


}