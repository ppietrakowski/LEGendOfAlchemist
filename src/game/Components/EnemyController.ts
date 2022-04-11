import Phaser from 'phaser'
import Character from '../Entities/Character'
import Enemy from '../Entities/Enemy'
import Player from '../Entities/Player'
import Component from './Component'
import Effect from './Effect'


enum AI_State {
    Roaming,
    DuringMove,
    Chasing,
    Attack,
    Aborted
}

function getRandomVector(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(Phaser.Math.Between(-1, 1), Phaser.Math.Between(-1, 1)).normalize()
}

function getRoamingPosition(startPos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
    let v = getRandomVector()
    let range = Phaser.Math.Between(2, 70)

    return new Phaser.Math.Vector2(startPos.x + v.x * range, startPos.y + v.y * range)
}

/**
 * TODO split behaviours to separate classes - pawelp
 */
export default class EnemyController implements Component {
    target: Player
    self: Enemy
    state: AI_State
    endPos: Phaser.Math.Vector2
    maxRange: number
    hitSound: Phaser.Sound.BaseSound

    constructor(target: Player, maxRange: number) {
        this.target = target
        this.state = AI_State.Roaming
        this.maxRange = maxRange
    }

    getName(): string {
        return 'enemy-movement';
    }

    start(character: Character): void {
        this.self = character as Enemy

        this.self.setVelocityX(0)
        this.self.setVelocityY(0)
        this.endPos = new Phaser.Math.Vector2(character.x, character.y)
        character.scene.physics.add.collider(character, this.target)

        this.hitSound = this.self.scene.sound.add('player-slap')
    }

    update(timeSinceLastFrame: number): void {
        this.state = this.getNextState()

        if (this.state === AI_State.DuringMove)
            this.onMoving(timeSinceLastFrame)
        if (this.state === AI_State.Roaming)
            this.onRoam(timeSinceLastFrame)
        else if (this.state === AI_State.Chasing)
            this.onChase(timeSinceLastFrame)
        else if (this.state === AI_State.Attack)
            this.onAttack(timeSinceLastFrame)
        else if (this.state === AI_State.Aborted)
            this.onAbort(timeSinceLastFrame)
    }

    private getNextState(): AI_State {
        let state: AI_State

        if (this.isPlayerNear())
            state = AI_State.Attack
        else if (this.isPlayerInRange())
            state = AI_State.Chasing
        else if (this.isPlayerOutOfRange() && this.state === AI_State.Chasing)
            state = AI_State.Aborted
        else if (this.state === AI_State.DuringMove)
            state = AI_State.DuringMove
        else
            state = AI_State.Roaming

        return state
    }

    private getDamage(timeSinceLastFrame: number): number {
        return -timeSinceLastFrame * 8 * this.self.attributes.strength
    }

    private isPlayerNear(): boolean {
        return this.self.isNearObject(this.target, 67)
    }

    private isPlayerInRange(): boolean {
        return this.self.isNearObject(this.target, this.maxRange)
    }

    private isPlayerOutOfRange(): boolean {
        return this.self.isNearObject(this.target, this.maxRange + 100)
    }

    private switchToRoaming(): void {
        this.self.setVelocity(0, 0)
        this.state = AI_State.Roaming
    }

    private onMoveUpOrDown(vel: Phaser.Math.Vector2): void {
        if (vel.y < 0)
            this.self.anims.play(`${this.self.name}-back-run`, true)
        else
            this.self.anims.play(`${this.self.name}-front-run`, true)
    }

    private onDirected(condition: boolean, vel: Phaser.Math.Vector2, animName: string): void {
        // left
        if (condition)
            this.self.anims.play(animName, true)
        else
            this.onMoveUpOrDown(vel)
    }

    private isDirectedInRightSide(): boolean {
        return this.self.body.velocity.x > 0
    }

    private playMoveAnim(): void {
        let vel = this.self.body.velocity

        if (this.isDirectedInRightSide())
            this.onDirected(vel.x > Math.abs(vel.y), vel, `${this.self.name}-right-run`)
        else
            this.onDirected(Math.abs(vel.x) > Math.abs(vel.y), vel, `${this.self.name}-left-run`)
    }

    // TODO proper movement
    private onRoam(timeSinceLastFrame: number): void {
        this.self.setVelocity(0, 0)
        this.endPos = getRoamingPosition(this.endPos)

        this.state = AI_State.DuringMove


        this.self.scene.physics.moveTo(this.self, this.endPos.x, this.endPos.y)
        this.playMoveAnim()
    }

    private onAttack(timeSinceLastFrame: number): void {
        // stops after chasing
        this.self.setVelocity(0, 0)

        if (!this.hitSound.isPlaying) {
            this.hitSound.play()
            // just attack
            this.target.attributes.addEffect(new Effect(this.getDamage(timeSinceLastFrame), 0, 0, 1))
        }
    }

    private onChase(timeSinceLastFrame: number): void {
        this.self.scene.physics.moveToObject(this.self, this.target, 40)
        this.playMoveAnim()
    }

    private onAbort(timeSinceLastFrame: number): void {
        // stops, if it chasing
        this.self.setVelocity(0, 0)
        this.switchToRoaming()
    }

    private onMoving(timeSinceLastFrame: number): void {
        if (this.self.isNear(this.endPos, 1.5)) {
            this.switchToRoaming()
        }
        else if (this.self.body.checkCollision.down || this.self.body.checkCollision.left || this.self.body.checkCollision.right || this.self.body.checkCollision.up) {
            this.self.body.velocity.x *= -1
            this.self.body.velocity.y *= -1
            this.switchToRoaming()
        }
    }
}