import Phaser from 'phaser'

/**
 * TODO this can just be a dom element
 */
export default class Button extends Phaser.GameObjects.Sprite {
    private onClick: Function

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, onClick: Function) {
        super(scene, x, y, texture)
        this.onClick = onClick

        this.setInteractive({ pixelPerfect: true })
        this.addEvents()

        this.setVisible(true)
        scene.add.existing(this)
    }

    private addEvents() {
        this.on(Phaser.Input.Events.POINTER_OVER, () => this.setTint(0x787878))
        this.on(Phaser.Input.Events.POINTER_OUT, () => this.clearTint())
        this.on(Phaser.Input.Events.POINTER_UP, this.onClick)
    }

}