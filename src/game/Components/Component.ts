

export interface Component {
    /**
     * A unique name of the component
     */
    getName(): string

    destroy(): void
}


export function addToUpdateList(scene: Phaser.Scene, fn: Function, context: any) {
    scene.events.on(Phaser.Scenes.Events.UPDATE, fn, context)
}