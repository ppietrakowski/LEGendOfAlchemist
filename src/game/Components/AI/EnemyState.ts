
import Character from '../../Entities/Character'
import EnemyController from './../EnemyController'

export abstract class EnemyState {

    protected owner: Character

    constructor (protected controller: EnemyController) {
        this.owner = controller.self
    }

    abstract stateStarted(): void
    stateClosed(): void {}

    update(_deltaTime: number) {}

    protected playMoveAnim(): void {
        let {velocity} = {velocity: this.owner.body.velocity}

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