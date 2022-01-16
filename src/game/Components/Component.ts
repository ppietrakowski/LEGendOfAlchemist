import Character from '../Entities/Character';

export default interface Component {
    /**
     * A name available to show debug info about objects
     */
    debugName(): string;

    /**
     * A unique name of the component
     */
    getName(): string;
    
    /**
     * A method called on adding component to class
     * @param character a gameobject that this component belongs to
     */
    start(character: Character): void;

    /**
     * A method called each frame to update the component
     * @param timeSinceLastFrame a time since last frame
     */
    update(timeSinceLastFrame: number): void;
}