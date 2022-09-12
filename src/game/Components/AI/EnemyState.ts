import GameObject from '../../Entities/GameObject'
import Controller from '../Controller'
import { AI_State } from './AI_State'


export abstract class EnemyState {
    constructor(protected readonly _controller: Controller, protected readonly _owner: GameObject) {
    }

    abstract stateStarted(...args: any[]): void;
    abstract getState(): AI_State;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    update(_deltaTime: number) { }

    protected playMoveAnim(): void {
        const { velocity } = this._owner.body

        if (this.isDirectedInRightSide())
            this.directedInLeftOrRight(
                velocity.x > Math.abs(velocity.y), velocity, `${this._owner.name}-right-run`)
        else
            this.directedInLeftOrRight(
                Math.abs(velocity.x) > Math.abs(velocity.y), velocity, `${this._owner.name}-left-run`)
    }

    private directedInLeftOrRight(condition: boolean, vel: Phaser.Math.Vector2, animName: string): void {
        // left
        if (condition)
            this._owner.anims.play(animName, true)
        else
            this.onMoveUpOrDown(vel)
    }

    private isDirectedInRightSide(): boolean {
        return this._owner.body.velocity.x > 0
    }

    private onMoveUpOrDown(vel: Phaser.Math.Vector2): void {
        const isRunningBackwards = vel.y < 0
        const ignoreWhenPlayer = true

        if (isRunningBackwards)
            this._owner.anims.play(`${this._owner.name}-back-run`, ignoreWhenPlayer)
        else
            this._owner.anims.play(`${this._owner.name}-front-run`, ignoreWhenPlayer)
    }
}