import GameObject from "../../Entities/GameObject";
import Controller from "../Controller";
import { EnemyState } from "./EnemyState";
import { AI_State } from './AI_State'


export function getRandomVector(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(Phaser.Math.Between(-1, 1), Phaser.Math.Between(-1, 1)).normalize()
}


export function getRoamingPosition(startPos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
    let v = getRandomVector()
    let range = Phaser.Math.Between(2, 70)

    return new Phaser.Math.Vector2(startPos.x + v.x * range, startPos.y + v.y * range)
}


export class RoamState extends EnemyState {
    public endPosition: Phaser.Math.Vector2

    constructor(controller: Controller, owner: GameObject) {
        super(controller, owner)
    }

    stateStarted(): void {
        this.endPosition = getRoamingPosition(this.owner.body.position)
        this.owner.setVelocity(0, 0)

        this.owner.scene.physics.moveTo(this.owner, this.endPosition.x, this.endPosition.y)
        this.playMoveAnim()

        this.controller.switchToNewState(AI_State.DURING_MOVE)
    }

    getState(): AI_State {
        return AI_State.ROAMING
    }
}