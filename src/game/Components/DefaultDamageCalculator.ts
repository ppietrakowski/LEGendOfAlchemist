import GameObject from "../Entities/GameObject";
import DamageCalculator from "./AI/DamageCalculator";


export default class DefaultDamageCalculator implements DamageCalculator {
    constructor(private readonly owner: GameObject) { }

    calculateDamage(_target: GameObject): number {
        return this.owner.attributes.strength.value * 0.1
    }
}