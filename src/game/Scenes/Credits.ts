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

        ## special thanks to
        * Authors of program Tiled.
        * Authors of program LibreSprite.
        * Make a field Music for sounds roam1
        * Mike Koenig for sounds: Pitch baseball, Light bulb breaking on license Creative Commons
        * Public domain: player-slap
        * Zacchary Dempsey-Plante for Pixellari font
        * MoppySound for 8-bit music
        * michaldrozdz2000 - cherries, orange, potion, red flower, player
        * MoppySound - roam2,menu music and attack   
        * Wiktoria Pietrakowska - tree, house tileset     
        `;
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.text(50, 50, this.text, { fontFamily: 'pixellari', fontSize: '20px', color: '#111155', stroke: '#fff', strokeThickness: 1 });
        this.back = new Button(this, 185, 500, 'back', onBack);
        this.back.scaleX = 0.5;
        this.back.scaleY = 0.5;
    }
}