import Character from "./Character";
import Component from "./Component";
import Effect from "./Effect";


export default class Attribute implements Component {
    hp: number;
    strength: number;
    wisdom: number;
    character: Character;
    private effects: Array<Effect>;

    constructor(hp: number, strength: number, wisdom: number) {
        this.hp = hp;
        this.strength = strength;
        this.wisdom = wisdom;
        this.effects = [];
    }

    debugName(): string {
        return 'atrributes';
    }

    getName(): string {
        return 'attributes';
    }
    start(character: Character): void {
        console.log(this);
        this.character = character;
    }
    
    update(timeSinceLastFrame: number): void {
        for (let effect of this.effects) {
            effect.update(timeSinceLastFrame);

            if (effect.hasTimePassed()) {

                this.deleteEffect(effect);
            }
        }
    }

    addEffect(effect: Effect): void {
        effect.start(this.character);
        this.effects.push(effect);
    }

    isAlive(): boolean {
        return this.hp >= 0;
    }

    private deleteEffect(effect: Effect): void {
        for (let i = 0; i < this.effects.length; i++) {

            if (this.effects[i] === effect) {

                this.effects.splice(i, 1);
            }

        }
    }
}