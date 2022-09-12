import Phaser from 'phaser'

interface ButtonClicked {
    (button: Button): void
}

export default class Button extends Phaser.Events.EventEmitter {
    private _image: Phaser.GameObjects.Image

    static readonly BUTTON_CLICKED = Symbol('Clicked')
    static readonly BUTTON_HOVER = Symbol('Hover')
    static readonly BUTTON_UNHOVER = Symbol('UnHover')

    constructor(image: Phaser.GameObjects.Image) {
        super()
        this._image = image

        this._image.setInteractive({ pixelPerfect: true })
        this._image.setVisible(true)

        this.addEvents()
    }

    addClickListener(fn: ButtonClicked, context: any): this {
        this.on(Button.BUTTON_CLICKED, fn, context)
        return this
    }

    private addEvents() {
        this.on(Button.BUTTON_HOVER, () => this._image.setTint(0x787878))
        this.on(Button.BUTTON_UNHOVER, this._image.clearTint, this._image)

        this._image.on(Phaser.Input.Events.POINTER_OVER, () => this.emit(Button.BUTTON_HOVER))
        this._image.on(Phaser.Input.Events.POINTER_OUT, () => this.emit(Button.BUTTON_UNHOVER))
        this._image.on(Phaser.Input.Events.POINTER_DOWN, () => this.emit(Button.BUTTON_CLICKED))
    }

    setNewImage(image: Phaser.GameObjects.Image) {
        this._image.destroy()
        this.removeAllListeners(Button.BUTTON_HOVER)
            .removeAllListeners(Button.BUTTON_UNHOVER)
            .removeAllListeners(Button.BUTTON_CLICKED)

        this._image = image
        this._image.setInteractive({ pixelPerfect: true })
        this.addEvents()
    }
}