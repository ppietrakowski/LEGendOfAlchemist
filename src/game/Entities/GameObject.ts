import Phaser from 'phaser'
import Attribute from '../Components/Attribute'
import { Component } from '../Components/Component'


interface ComponentDictionary {
    [key: string]: Component;
}

export default abstract class GameObject extends Phaser.Physics.Arcade.Sprite {
    private _components: ComponentDictionary
    static readonly GAMEOBJECT_UPDATE = Symbol('GameObjectUpdate')

    get attributes(): Attribute {
        return this.getComponent<Attribute>(Attribute.COMPONENT_NAME)
    }

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame: string | number) {
        super(scene, x, y, texture, frame)
        this._components = {}
        this.setInteractive({ pixelPerfect: true })
        this.addComponent(new Attribute(this, 100, 20, 10))

        scene.physics.add.existing(this)
        scene.add.existing(this)

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    }

    destroy(fromScene?: boolean): void {

        if (!this.scene)
            return

        this.removeAllListeners(GameObject.GAMEOBJECT_UPDATE)
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this)

        for (const key in this._components) {
            this._components[key].destroy()
        }
        
        this._components = null
        super.destroy(fromScene ? true : false)
    }

    addComponent(component: Component): void {
        this._components[component.getName()] = component
    }

    getComponent<T extends Component>(name: string): T {
        return this._components[name] as T
    }

    isNear(point: Phaser.Math.Vector2, maxTolerance = 1): boolean {
        return Phaser.Math.Distance.Between(point.x, point.y, this.x, this.y) <= maxTolerance
    }

    isNearObject(gameobject: Phaser.GameObjects.Sprite, maxTolerance = 30): boolean {
        return Phaser.Math.Distance.Between(gameobject.x, gameobject.y, this.x, this.y) <= maxTolerance
    }

    update(_time: number, deltaTime: number): void {
        this.emit(GameObject.GAMEOBJECT_UPDATE, deltaTime * 0.001)
    }
}