import Character from '../Entities/Character';
import Component from './Component';


export default class Effect implements Component {
    deltaHp: number;
    deltaStrength: number;
    deltaWisdom: number;
    character: Character;
    private timePassed: number;
    readonly duration: number;

    constructor(deltaHp: number, deltaStrength: number, deltaWisdom: number, duration: number) {
        this.deltaHp = deltaHp;
        this.deltaStrength = deltaStrength;
        this.deltaWisdom = deltaWisdom;
        this.timePassed = 0;
        this.duration = duration;
    }

    debugName(): string {
        return `Effect\{dHp: ${this.deltaHp}, dStrength: ${this.deltaStrength}, dWisdom: ${this.deltaWisdom}, duration: ${this.duration} \}`;
    }

    getName(): string {
        return 'Effect';
    }

    start(character: Character): void {
        this.character = character;
    }

    update(timeSinceLastFrame: number): void {
        this.timePassed += timeSinceLastFrame;
        let atrributes = this.character.attributes;

        atrributes.hp += this.deltaHp * timeSinceLastFrame;
        atrributes.wisdom += this.deltaWisdom * timeSinceLastFrame;
        atrributes.strength += this.deltaStrength * timeSinceLastFrame;
    }

    hasTimePassed(): boolean {
        return this.timePassed >= this.duration;
    }
}