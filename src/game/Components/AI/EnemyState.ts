
import GameObject from '../../Entities/GameObject'
import Controller from '../Controller'
import {AI_State} from './AI_State'

export abstract class EnemyState {
    constructor (protected readonly controller: Controller, protected readonly owner: GameObject) {
    }

    abstract stateStarted(): void
    stateClosed(): void {}

    update(_deltaTime: number) {}

    abstract getState(): AI_State

    protected playMoveAnim(): void {
        let {velocity} = this.owner.body

        if (this.isDirectedInRightSide())
            this.directedInLeftOrRight(velocity.x > Math.abs(velocity.y), velocity, `${this.owner.name}-right-run`)
        else
            this.directedInLeftOrRight(Math.abs(velocity.x) > Math.abs(velocity.y), velocity, `${this.owner.name}-left-run`)
    }

    private directedInLeftOrRight(condition: boolean, vel: Phaser.Math.Vector2, animName: string): void {
        // left
        if (condition)
            this.owner.anims.play(animName, true)
        else
            this.onMoveUpOrDown(vel)
    }

    private isDirectedInRightSide(): boolean {
        return this.owner.body.velocity.x > 0
    }

    private onMoveUpOrDown(vel: Phaser.Math.Vector2): void {
        if (vel.y < 0)
            this.owner.anims.play(`${this.owner.name}-back-run`, true)
        else
            this.owner.anims.play(`${this.owner.name}-front-run`, true)
    }
}