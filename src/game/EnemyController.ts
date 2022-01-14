import Phaser from "phaser";
import Character from "./Character";
import Component from "./Component";
import Enemy from "./Enemy";
import Player from './Player'
import Effect from "./Effect";

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
        this.spawnPoint = new Phaser.Math.Vector2(character.sprite.x, character.sprite.y);
        this.self.sprite.setVelocity(0, 0);
        character.sprite.scene.physics.add.collider(character.sprite, this.target.sprite);
    }

    getNextState(): AI_State {
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

    private isReturningToStart() {
        return this.state === AI_State.Aborted || this.state === AI_State.DuringReturning;
    }

    private getDamage(timeSinceLastFrame: number): number {
        return -timeSinceLastFrame * this.self.attributes.strength;
    }

    private isPlayerNear(): boolean {
        return this.self.isNearObject(this.target.sprite, 60);
    }

    private isPlayerInRange(): boolean {
        return this.self.isNearObject(this.target.sprite, 200);
    }

    private isPlayerOutOfRange(): boolean {
        return this.self.isNearObject(this.target.sprite, 300);
    }

    private isNearSpawnpoint(): boolean {
        return this.self.isNear(this.spawnPoint, 1);
    }

    private switchToRoaming() {
        this.self.sprite.setVelocity(0, 0);
        this.state = AI_State.Roaming;
        this.self.sprite.anims.play('enemy-stay', true);
    }

    // TODO proper movement
    private onRoam(timeSinceLastFrame: number): void {
        this.self.sprite.setVelocity(0, 0);
        this.endPos = getRoamingPosition(this.spawnPoint);

        this.state = AI_State.DuringMove;

        this.self.sprite.scene.physics.moveTo(this.self.sprite, this.endPos.x, this.endPos.y);
    }

    private onAttack(timeSinceLastFrame: number): void {
        // stops after chasing
        this.self.sprite.setVelocity(0, 0);
        this.self.sprite.anims.play('enemy-attack', true);

        // just attack
        this.target.attributes.addEffect(new Effect(this.getDamage(timeSinceLastFrame), 0, 0, 1));
    }

    private onChase(timeSinceLastFrame: number): void {
        this.self.sprite.anims.play('enemy-attack', true);
        this.self.sprite.scene.physics.moveToObject(this.self.sprite, this.target.sprite, 40);
    }

    private onAbort(timeSinceLastFrame: number): void {
        // stops, if it chasing
        this.self.sprite.setVelocity(0, 0);

        // moves back to spawnpoint
        this.self.sprite.scene.physics.moveTo(this.self.sprite, this.spawnPoint.x, this.spawnPoint.y);

        // just play move animation
        this.self.sprite.anims.play('enemy-attack', true);
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