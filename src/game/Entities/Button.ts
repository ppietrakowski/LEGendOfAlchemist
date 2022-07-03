import Phaser from 'phaser'

/**
 * TODO this can just be a dom element
 */
export default class Button extends Phaser.Events.EventEmitter {

    private image: Phaser.GameObjects.Image

    static readonly BUTTON_CLICKED = "Clicked"
    static readonly BUTTON_HOVER = "Hover"
    static readonly BUTTON_UNHOVER = "UnHover"

    constructor(image: Phaser.GameObjects.Image) {
        super()
        this.image = image

        this.image.setInteractive({ pixelPerfect: true })
        this.image.setVisible(true)

        this.addEvents()
    }

    addClickListener(fn: Function, context: any) {
        this.on(Button.BUTTON_CLICKED, fn, context)
    }

    setNewImage(image: Phaser.GameObjects.Image) {
        this.image.destroy()
        this.removeAllListeners(Button.BUTTON_HOVER)
            .removeAllListeners(Button.BUTTON_UNHOVER)
            .removeAllListeners(Button.BUTTON_CLICKED)
            
        this.image = image
        this.image.setInteractive({ pixelPerfect: true })

        this.addEvents()
    }

    private addEvents() {
        this.on(Button.BUTTON_HOVER, () => this.image.setTint(0x787878))
        this.on(Button.BUTTON_UNHOVER, this.image.clearTint, this.image)

        this.image.on(Phaser.Input.Events.POINTER_OVER, () => this.emit(Button.BUTTON_HOVER))
        this.image.on(Phaser.Input.Events.POINTER_OUT, () => this.emit(Button.BUTTON_UNHOVER))
        this.image.on(Phaser.Input.Events.POINTER_DOWN, () => this.emit(Button.BUTTON_CLICKED))
    }
        
}