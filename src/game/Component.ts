import Character from "./Character";

export default interface Component {
    getName(): string;
    start(character: Character): void;
    update(timeSinceLastFrame: number): void;
}