import GameObject from '../../Entities/GameObject'
import Controller from '../Controller'
import { EnemyState } from './EnemyState'
import { AI_State } from './AI_State'

export function getRandomVector(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(Phaser.Math.Between(-1, 1), Phaser.Math.Between(-1, 1)).normalize()
}

export function getRoamingPosition(startPos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
    const v = getRandomVector()
    const range = Phaser.Math.Between(2, 70)

    return new Phaser.Math.Vector2(startPos.x + v.x * range, startPos.y + v.y * range)
}

export class RoamState extends EnemyState {
    constructor(controller: Controller, owner: GameObject) {
        super(controller, owner)
    }

    stateStarted(): void {
        const endPosition = getRoamingPosition(this._owner.body.position)
        this._owner.setVelocity(0)

        this._owner.scene.physics.moveTo(this._owner, endPosition.x, endPosition.y)
        this.playMoveAnim()

        this._controller.switchToNewState(AI_State.DURING_MOVE, endPosition)
    }

    getState(): AI_State {
        return AI_State.ROAMING
    }
}