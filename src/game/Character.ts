import Component from "./Component";

interface ComponentDictionary {
    [key: string]: Component
}

export default abstract class Character {
    private components: ComponentDictionary;
    sprite: Phaser.GameObjects.Sprite;
    
    constructor() {
        this.components = {};
    }

    addComponent(component: Component): void {
        this.components[component.getName()] = component;
        component.start(this);
    }

    getComponent<T extends Component>(name: string): T {
        return this.components[name] as T;
    }
    
    abstract start(scene: Phaser.Scene): void;

    update(timePassedSinceLastFrame: number): void {
        for (let i in this.components) {
            this.components[i].update(timePassedSinceLastFrame);
        }
    }

    abstract makeDead(): void;
}