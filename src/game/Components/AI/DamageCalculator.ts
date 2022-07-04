import GameObject from "../../Entities/GameObject";


export default interface DamageCalculator {
    calculateDamage(target: GameObject): number
}