import Phaser from 'phaser';

import Component from './Component';
import Effect from './Effect';

import Character from '../Entities/Character';
import Enemy from '../Entities/Enemy';
import Player from '../Entities/Player'

enum AI_State {
    Roaming,
    DuringMove,
    Chasing,
    Attack,
    Aborted,
    DuringReturning
}

function getRandomVector(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(Phaser.Math.Between(-1, 1), Phaser.Math.Between(-1, 1)).normalize();
}

function getRoamingPosition(startPos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
    let v = getRandomVector();
    let range = Phaser.Math.Between(10, 70);

    return new Phaser.Math.Vector2(startPos.x + v.x * range, startPos.y + v.y * range);
}

export default class EnemyController implements Component {
    target: Player;
    self: Enemy;
    state: AI_State;
    spawnPoint: Phaser.Math.Vector2;
    endPos: Phaser.Math.Vector2;
    maxRange: number;
    hitSound: Phaser.Sound.BaseSound;

    constructor(target: Player, maxRange: number) {
        this.target = target;
        this.state = AI_State.Roaming;
        this.maxRange = maxRange;
    }

    debugName(): string {
        return 'Enemy Movement';
    }

    getName(): string {
        return 'enemy-movement';
    }

    start(character: Character): void {
        this.self = character as Enemy;
        this.spawnPoint = new Phaser.Math.Vector2(character.sprite.x, character.sprite.y);
        this.self.sprite.setVelocity(0, 0);
        character.sprite.scene.physics.add.collider(character.sprite, this.target.sprite);
        this.hitSound = this.self.sprite.scene.sound.add('player-slap');
    }

    update(timeSinceLastFrame: number): void {
        this.state = this.getNextState();

        if (this.state === AI_State.DuringMove)
            this.onMoving(timeSinceLastFrame);
        if (this.state === AI_State.Roaming)
            this.onRoam(timeSinceLastFrame);
        else if (this.state === AI_State.Chasing)
            this.onChase(timeSinceLastFrame);
        else if (this.state === AI_State.Attack)
            this.onAttack(timeSinceLastFrame);
        else if (this.state === AI_State.Aborted)
            this.onAbort(timeSinceLastFrame);
        else if (this.state === AI_State.DuringReturning)
            this.onReturningToStart(timeSinceLastFrame);
    }

    private getNextState(): AI_State {
        let state: AI_State;

        if (this.isPlayerNear())
            state = AI_State.Attack;
        else if (this.isPlayerInRange())
            state = AI_State.Chasing;
        else if (this.isReturningToStart())
            state = AI_State.DuringReturning;
        else if (this.isPlayerOutOfRange() && this.state === AI_State.Chasing)
            state = AI_State.Aborted;
        else if (this.state === AI_State.DuringMove)
            state = AI_State.DuringMove;
        else
            state = AI_State.Roaming;

        return state;
    }

    private isReturningToStart() {
        return this.state === AI_State.Aborted || this.state === AI_State.DuringReturning;
    }

    private getDamage(timeSinceLastFrame: number): number {
        return -timeSinceLastFrame * this.self.attributes.strength;
    }

    private isPlayerNear(): boolean {
        return this.self.isNearObject(this.target.sprite, 49);
    }

    private isPlayerInRange(): boolean {
        return this.self.isNearObject(this.target.sprite, this.maxRange);
    }

    private isPlayerOutOfRange(): boolean {
        return this.self.isNearObject(this.target.sprite, this.maxRange + 100);
    }

    private isNearSpawnpoint(): boolean {
        return this.self.isNear(this.spawnPoint, 1);
    }

    private switchToRoaming(): void {
        this.self.sprite.setVelocity(0, 0);
        this.state = AI_State.Roaming;
        this.self.sprite.anims.play(`${this.self.name}-stay`, true);
    }

    private onMoveUpOrDown(vel: Phaser.Math.Vector2): void {
        if (vel.y < 0)
            this.self.sprite.anims.play(`${this.self.name}-back-run`, true);
        else
            this.self.sprite.anims.play(`${this.self.name}-front-run`, true);
    }

    private onDirected(condition: boolean, vel: Phaser.Math.Vector2, animName: string): void {
        // left
        if (condition)
            this.self.sprite.anims.play(animName, true);
        else
            this.onMoveUpOrDown(vel);
    }

    private isDirectedInRightSide(): boolean {
        return this.self.sprite.body.velocity.x > 0;
    }

    private playMoveAnim(): void {
        let vel = this.self.sprite.body.velocity;

        if (this.isDirectedInRightSide())
            this.onDirected(vel.x > Math.abs(vel.y), vel, `${this.self.name}-right-run`);
        else
            this.onDirected(Math.abs(vel.x) > Math.abs(vel.y), vel, `${this.self.name}-left-run`);
    }

    // TODO proper movement
    private onRoam(timeSinceLastFrame: number): void {
        this.self.sprite.setVelocity(0, 0);
        this.endPos = getRoamingPosition(this.spawnPoint);

        this.state = AI_State.DuringMove;

        this.playMoveAnim();
        this.self.sprite.scene.physics.moveTo(this.self.sprite, this.endPos.x, this.endPos.y);
    }

    private onAttack(timeSinceLastFrame: number): void {
        // stops after chasing
        this.self.sprite.setVelocity(0, 0);

        // just attack
        this.target.attributes.addEffect(new Effect(this.getDamage(timeSinceLastFrame), 0, 0, 0.25));
        
        if (!this.hitSound.isPlaying)
            this.hitSound.play();
    }

    private onChase(timeSinceLastFrame: number): void {
        this.self.sprite.scene.physics.moveToObject(this.self.sprite, this.target.sprite, 40);
        this.playMoveAnim();
    }

    private onAbort(timeSinceLastFrame: number): void {
        // stops, if it chasing
        this.self.sprite.setVelocity(0, 0);

        // moves back to spawnpoint
        this.self.sprite.scene.physics.moveTo(this.self.sprite, this.spawnPoint.x, this.spawnPoint.y);

        // just play move animation
        this.self.sprite.anims.play(`${this.self.name}-front-run`, true);
    }

    private onReturningToStart(timeSinceLastFrame: number): void {
        if (this.isNearSpawnpoint())
            this.switchToRoaming();
    }

    private onMoving(timeSinceLastFrame: number): void {
        if (this.self.isNear(this.endPos, 2))
            this.switchToRoaming();
    }
}