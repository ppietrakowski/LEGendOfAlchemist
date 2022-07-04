import Phaser from 'phaser'
import Attribute from "../Components/Attribute"
import { Component } from "../Components/Component"


interface ComponentDictionary {
    [key: string]: Component
}

export default abstract class GameObject extends Phaser.Physics.Arcade.Sprite {
    private components: ComponentDictionary

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame: string | number) {
        super(scene, x, y, texture, frame)
        this.components = {}
        this.setInteractive({ pixelPerfect: true })
        this.addComponent(new Attribute(this, 100, 20, 10))

        scene.physics.add.existing(this)
        scene.add.existing(this)
    }

    destroy(fromScene?: boolean): void {
        for (const component of Object.values(this.components))
            component.destroy()
        super.destroy(fromScene)
    }

    addComponent(component: Component): void {
        this.components[component.getName()] = component
    }

    getComponent<T extends Component>(name: string): T {
        return this.components[name] as T
    }

    get attributes(): Attribute {
        return this.getComponent<Attribute>('attributes')
    }

    isNear(point: Phaser.Math.Vector2, maxTolerance: number = 1): boolean {
        return Phaser.Math.Distance.Between(point.x, point.y, this.x, this.y) <= maxTolerance
    }

    isNearObject(gameobject: Phaser.GameObjects.Sprite, maxTolerance: number = 30): boolean {
        return Phaser.Math.Distance.Between(gameobject.x, gameobject.y, this.x, this.y) <= maxTolerance
    }
}