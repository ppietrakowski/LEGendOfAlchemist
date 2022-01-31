

export default class WinScene extends Phaser.Scene {

    constructor() {
        super('WinScene')
    }

    create(): void {

        this.time.addEvent({
            elapsed: 1000,
            callback: () => this.game.scene.switch('WinScene', 'MainMenu')
    })
        
    }


}