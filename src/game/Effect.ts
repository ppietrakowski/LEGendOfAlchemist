import Attribute from "./Attribute";
import Character from "./Character";
import Component from "./Component";

export default class Effect implements Component {
    private deltaHp: number;
    private deltaStrength: number;
    private deltaWisdom: number;
    private character: Character;
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
        console.log(character);
        this.character = character;
    }

    update(timeSinceLastFrame: number): void {
        this.timePassed += timeSinceLastFrame;
        let atrributes = this.character.getComponent<Attribute>('attributes');

        atrributes.hp += this.deltaHp * timeSinceLastFrame;
        atrributes.wisdom += this.deltaWisdom * timeSinceLastFrame;
        atrributes.strength += this.deltaStrength * timeSinceLastFrame;

        atrributes.hp = Math.ceil(atrributes.hp);
        atrributes.wisdom = Math.ceil(atrributes.wisdom);
        atrributes.strength = Math.ceil(atrributes.strength);

        console.log(timeSinceLastFrame);
    }
    
    hasTimePassed(): boolean {
        return this.timePassed >= this.duration;
    }
}