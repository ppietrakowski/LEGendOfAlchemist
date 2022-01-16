import Phaser from 'phaser';

import Attribute from "../Components/Attribute";
import Component from "../Components/Component";

interface ComponentDictionary {
    [key: string]: Component
}

export default abstract class Character {
    private components: ComponentDictionary;
    sprite: Phaser.Physics.Arcade.Sprite;

    constructor(sprite: Phaser.Physics.Arcade.Sprite) {
        this.components = {};
        this.sprite = sprite;
        sprite.setInteractive({pixelPerfect: true});
        this.addComponent(new Attribute(100, 20, 10));
    }

    // TODO: console.log should be called in debug mode only
    addComponent(component: Component): void {
        console.log(component.debugName());
        
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

    get attributes(): Attribute {
        return this.getComponent<Attribute>('attributes');
    }

    abstract makeDead(): void;

    isDead(): boolean {
        return !this.attributes.isAlive();
    }

    isNear(point: Phaser.Math.Vector2, maxTolerance: number = 1): boolean {
        return Phaser.Math.Distance.Between(point.x, point.y, this.sprite.x, this.sprite.y) <= maxTolerance;
    }

    isNearObject(gameobject: Phaser.GameObjects.Sprite, maxTolerance: number = 1): boolean {
        return Phaser.Math.Distance.Between(gameobject.x, gameobject.y, this.sprite.x, this.sprite.y) <= maxTolerance;
    }
}