import Phaser from 'phaser'

/**
 * TODO this can just be a dom element
 */
export default class Button extends Phaser.Events.EventEmitter {

    private image: Phaser.GameObjects.Sprite

    static readonly Clicked = "Clicked"
    static readonly Hover = "Hover"
    static readonly UnHover = "UnHover"

    constructor(image: Phaser.GameObjects.Sprite) {
        super()
        this.image = image

        this.image.setInteractive({ pixelPerfect: true })
        this.image.setVisible(true)

        this.addEvents()
    }

    addClickListener(fn: Function, context: any) {
        this.on(Button.Clicked, fn, context)
    }

    setNewImage(image: Phaser.GameObjects.Sprite) {
        this.image.destroy()
        this.removeAllListeners(Button.Hover)
            .removeAllListeners(Button.UnHover)
            .removeAllListeners(Button.Clicked)
            
        this.image = image
        this.image.setInteractive({ pixelPerfect: true })

        this.addEvents()
    }

    private addEvents() {
        this.on(Button.Hover, () => this.image.setTint(0x787878))
        this.on(Button.UnHover, this.image.clearTint, this.image)

        this.image.on(Phaser.Input.Events.POINTER_OVER, () => this.emit(Button.Hover))
        this.image.on(Phaser.Input.Events.POINTER_OUT, () => this.emit(Button.UnHover))
        this.image.on(Phaser.Input.Events.POINTER_DOWN, () => this.emit(Button.Clicked))
    }
        
}