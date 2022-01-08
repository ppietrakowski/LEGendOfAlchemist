/// <reference path="../../phaser/phaser.d.ts"/>
import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

    }

    preload(): void {

    }
    
    create(): void {
        this.add.text(100, 100, '!! OK !!', {color: '#ff0fff'});
    }

}