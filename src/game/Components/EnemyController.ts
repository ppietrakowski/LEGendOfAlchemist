import Phaser from 'phaser'
import Enemy from '../Entities/Enemy'
import Player from '../Entities/Player'
import {Component, addToUpdateList } from './Component'

import { EnemyState } from './AI/EnemyState'
import { RoamState } from './AI/RoamState'

enum AI_State {
    Roaming,
    DuringMove,
    Chasing,
    Attack,
    Aborted
}

/**
 * TODO split behaviours to separate classes - pawelp
 */
export default class EnemyController implements Component {
    private state: AI_State
    private endPos: Phaser.Math.Vector2
    private hitSound: Phaser.Sound.BaseSound

    private currentState: EnemyState

    constructor(public readonly player: Player, private readonly possesedPawn: Enemy, public readonly maxDetectionRange: number) {
        this.state = AI_State.Roaming
        this.endPos = new Phaser.Math.Vector2(this.possesedPawn.x, this.possesedPawn.y)
        
        this.start()
    }

    getName(): string {
        return 'enemy-movement';
    }

    private start(): void {
        const {scene} = this.possesedPawn

        this.possesedPawn.setVelocityX(0)
        this.possesedPawn.setVelocityY(0)
        
        scene.physics.add.collider(this.possesedPawn, this.player)

        this.currentState = new RoamState(this, this.possesedPawn);
        this.currentState.stateStarted()

        this.hitSound = scene.sound.add('player-slap')

        addToUpdateList(this.possesedPawn.scene, this.update, this)
    }

    update(_time: number, deltaTime: number): void {
        //this.state = this.getNextState()

        this.currentState.update(deltaTime)
    }

    switchToNewState(state: EnemyState) {
        this.currentState.stateClosed()
        this.currentState = state
        state.stateStarted()
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

    private isPlayerNear(): boolean {
        return this.possesedPawn.isNearObject(this.player, 67)
    }

    private isPlayerInRange(): boolean {
        return this.possesedPawn.isNearObject(this.player, this.maxDetectionRange)
    }

    private isPlayerOutOfRange(): boolean {
        return this.possesedPawn.isNearObject(this.player, this.maxDetectionRange + 100)
    }

    private switchToRoaming(): void {
        this.possesedPawn.setVelocity(0, 0)
        this.state = AI_State.Roaming
    }


    /*
    // TODO proper movement
    private onRoam(): void {
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
            this.hitSound.play({volume: 0.2})
            // just attack
            this.target.attributes.addEffect(new Effect(this.getDamage(timeSinceLastFrame), 0, 0, 1))
        }
    }

    private onChase(): void {
        this.self.scene.physics.moveToObject(this.self, this.target, 40)
        this.playMoveAnim()
    }

    private onAbort(): void {
        // stops, if it chasing
        this.self.setVelocity(0, 0)
        this.switchToRoaming()
    }

    private onMoving(): void {
        if (this.self.isNear(this.endPos, 1.5)) {
            this.switchToRoaming()
        }
        else if (this.self.body.checkCollision.down || this.self.body.checkCollision.left || this.self.body.checkCollision.right || this.self.body.checkCollision.up) {
            this.switchToRoaming()
        }
    }
    */
}
