
import Attribute from "./Attribute";
import Component from "./Component";

interface ComponentDictionary {
    [key: string]: Component
}

export default abstract class Character {
    private components: ComponentDictionary;
    sprite: Phaser.Physics.Arcade.Sprite;

    constructor(sprite: Phaser.Physics.Arcade.Sprite) {
        this.components = {};
        this.sprite = sprite;
        this.addComponent(new Attribute(100, 50, 10));
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
        if (this.isDead())
            this.makeDead();
    }

    get attribute(): Attribute {
        return this.getComponent<Attribute>('attributes');
    }

    abstract makeDead(): void;

    abstract isDead(): boolean;
}