import GameObject from '../Entities/GameObject'
import IDamageCalculator from './AI/DamageCalculator'


export default class DefaultDamageCalculator implements IDamageCalculator {
    constructor(private readonly _owner: GameObject) { }

    calculateDamage(_target: GameObject): number {
        return this._owner.attributes.strength.value * 0.85
    }
}