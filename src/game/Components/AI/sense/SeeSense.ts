import GameObject from '../../../Entities/GameObject'
import { EnemySensing, SenseType, SensingListener } from './EnemySensing'


export default class SeeSense implements EnemySensing {
    private _listeners: SensingListener[]

    private static readonly OutOfRangeOffset = 100

    constructor(private readonly _possesedEnemy: GameObject, private readonly _target: GameObject,
        private readonly _maxDetectionRange: number) {
        this._listeners = []
    }

    removeSenseListener(sensingListener: SensingListener): void {
        this._listeners = this._listeners.filter(value => value !== sensingListener)
    }

    addSenseListener(sensingListener: SensingListener): void {
        this._listeners.push(sensingListener)
    }

    private isPlayerInRange(): boolean {
        return this._possesedEnemy.isNearObject(this._target, this._maxDetectionRange)
    }

    private emitEnemySensed() {
        for (const listener of this._listeners)
            listener.sensed(this._target, SenseType.SEE_SENSE)
    }

    private isPlayerOutOfRange(): boolean {
        return this._possesedEnemy.isNearObject(this._target, this._maxDetectionRange + SeeSense.OutOfRangeOffset)
    }

    private emitEnemyStopSensing() {
        for (const listener of this._listeners)
            listener.stopsSensing(this._target, SenseType.SEE_SENSE)
    }

    update(_deltaTime: number): void {
        if (this.isPlayerInRange())
            this.emitEnemySensed()
        else if (this.isPlayerOutOfRange())
            this.emitEnemyStopSensing()
    }
}