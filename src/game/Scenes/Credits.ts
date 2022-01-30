import Phaser from 'phaser';

import Button from '../Entities/Button';

function onBack(this: Phaser.GameObjects.Sprite): void {
    this.scene.game.scene.switch('Credits', 'MainMenu');
}


export default class Credits extends Phaser.Scene {
    private text: string;
    private back: Button;

    constructor() {
        super('Credits');
    }

    preload(): void {
        this.text = `
        Created by ppietrakowski, SebaPGK, MichalDrozdz2000

        Font: https://www.dafont.com/pixellari.font
        Sound icon: https://www.flaticon.com/premium-icon/musical-note_461146
        Background: https://pixabay.com/illustrations/planet-sience-fiction-fantasy-world-1702788/
        
        
        
        `;
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.text(50, 50, this.text, {fontFamily: 'pixellari', fontSize: '20px', color: '#111155', stroke: '#fff', strokeThickness: 1 });
        this.back = new Button(this, 185, 500, 'back', onBack);
        this.back.scaleX = 0.5;
        this.back.scaleY = 0.5;
    }
}