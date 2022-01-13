import Phaser from "phaser";
import Character from "./Character";
import Component from "./Component";
import Enemy from "./Enemy";
import Player from './Player'
import SimplexNoise from 'simplex-noise'
import Effect from "./Effect";

const noise = new SimplexNoise();

enum AI_State {
    Roaming,
    Chasing,
    Attack,
    Aborted
}

export default class EnemyController implements Component {
    target: Player;
    self: Enemy;
    state: AI_State;
    startPos: Phaser.Math.Vector2;

    constructor(target: Player) {
        this.target = target;
        
        this.state = AI_State.Roaming;
    }

    debugName(): string {
        return 'Enemy Movement';
    }

    getName(): string {
        return 'enemy-movement';
    }


    start(character: Character): void {
        this.self = character;
        this.startPos = new Phaser.Math.Vector2(character.sprite.x, character.sprite.y);
        this.self.sprite.setVelocity(0, 0);
    }

    getNextState(): AI_State {
        let state: AI_State;
        
        if (this.isPlayerNear())
            state = AI_State.Attack;
        else if (this.isPlayerInRange())
           state = AI_State.Chasing;
        else if (this.isPlayerOutOfRange())
            state = AI_State.Aborted;
        else
            state = AI_State.Roaming;
        
        console.log(state);
        
        return state;
    }

    update(timeSinceLastFrame: number): void {
        this.state = this.getNextState();

        if (this.state === AI_State.Roaming)
            this.onRoam(timeSinceLastFrame);
        else if (this.state === AI_State.Chasing)
            this.onChase(timeSinceLastFrame);
        else if (this.state === AI_State.Attack)
            this.onAttack(timeSinceLastFrame);
        else if (this.state === AI_State.Aborted)
            this.onAbort(timeSinceLastFrame);
    }

    private getDamage(timeSinceLastFrame: number): number {
        return -timeSinceLastFrame * this.self.attribute.strength;
    }

    private isPlayerNear(): boolean {
        let player = this.target.sprite;
        let enemy = this.self.sprite;
        
        return Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) < 50;
    }

    private isPlayerInRange(): boolean {
        let player = this.target.sprite;
        let enemy = this.self.sprite;
        
        return Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) < 100;
    }
    
    private isPlayerOutOfRange(): boolean {
        let player = this.target.sprite;
        let enemy = this.self.sprite;
        
        return Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) < 300;
    }
    // TODO proper movement
    private onRoam(timeSinceLastFrame: number): void {
        
    }

    private onAttack(timeSinceLastFrame: number): void {
        this.self.sprite.setVelocity(0, 0);
        this.self.sprite.anims.play('enemy-attack', true);
        this.target.attribute.addEffect(new Effect(this.getDamage(timeSinceLastFrame), 0, 0, 1));
    }

    private onChase(timeSinceLastFrame: number): void {
        this.self.sprite.anims.play('enemy-attack', true);
        this.self.sprite.scene.physics.moveToObject(this.self.sprite, this.target.sprite, 40);
    }

    private onAbort(timeSinceLastFrame: number): void {
        this.self.sprite.setVelocity(0, 0);
        this.self.sprite.body.x = this.startPos.x;
        this.self.sprite.body.y = this.startPos.y;
        this.self.sprite.anims.play('enemy-stay', true);
    }
}