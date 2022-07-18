import GameObject from "../../Entities/GameObject";


export default interface IDamageCalculator {
    calculateDamage(target: GameObject): number
}