import Phaser from 'phaser'

import Character from './Character'

import PlayerMovement from '../Components/PlayerMovement'
import Attribute from '../Components/Attribute'
import PlayerHealthBar from '../Components/PlayerHealthBar'

export default class Player extends Character {

    constructor(sprite: Phaser.Physics.Arcade.Sprite) {
        super(sprite);
        this.addComponent(new Attribute(100, 50, 10));
        this.addComponent(new PlayerMovement(new Phaser.Math.Vector2(100, 100)));
        this.addComponent(new PlayerHealthBar(this));
        sprite.setScrollFactor(1);
        sprite.scene.cameras.main.startFollow(sprite, true, 0.08, 0.08);
        this.start();
    }

    start(): void {
        this.addAnimations();
        this.sprite.anims.play('front', false);

        this.sprite.scaleX = 1.5;
        this.sprite.scaleY = 1.5;   
    }

    makeDead(): void {
        // for now just show dead screen
        this.sprite.scene.game.scene.switch('GameScene', 'DeadScene');
    }

    private addAnimations(): void {
        let anims = this.sprite.anims;
        anims.create(
            {
                key: 'front',
                frames: anims.generateFrameNumbers('player', { start: 0, end: 0 }),
                repeat: -1,
                frameRate: 5
            });

        anims.create(
            {
                key: 'front-run',
                frames: anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                frameRate: 5
            });


        anims.create(
            {
                key: 'back',
                frames: anims.generateFrameNumbers('player', { start: 4, end: 4 }),
                repeat: -1,
                frameRate: 5
            });

        anims.create(
            {
                key: 'back-run',
                frames: anims.generateFrameNumbers('player', { start: 4, end: 7 }),
                repeat: -1,
                frameRate: 5
            });

        anims.create(
            {
                key: 'left-run',
                frames: anims.generateFrameNumbers('player', { start: 12, end: 15 }),
                repeat: -1,
                frameRate: 5
            });

        anims.create(
            {
                key: 'right-run',
                frames: anims.generateFrameNumbers('player', { start: 8, end: 11 }),
                repeat: -1,
                frameRate: 5
            });
    }
}