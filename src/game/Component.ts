import Character from "./Character";

export default interface Component {
    debugName(): string;
    getName(): string;
    start(character: Character): void;
    update(timeSinceLastFrame: number): void;
}