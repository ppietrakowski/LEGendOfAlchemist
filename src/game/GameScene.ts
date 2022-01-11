
import Player from './Player'
import DeadScene from './DeadScene'
import Attribute from './Attribute'
import Effect from './Effect';

export default class GameScene extends Phaser.Scene {

    player: Player;
    constructor() {
        super('GameScene');
    }

    preload(): void {
        this.load.spritesheet('characters', 'assets/characters-2.png', { frameWidth: 16, frameHeight: 16 });
    }

    create(): void {
        

        this.player = new Player(this.physics.add.sprite(100, 100, 'characters'));
        this.createPlayerAnims();

        this.player.sprite.anims.play('front', false);
        this.player.sprite.scaleX = 5;
        this.player.sprite.scaleY = 5;
    }

    update(time: number, delta: number): void {
        this.player.update(delta / 1000);

        
        if (this.player.isDead()) {
            this.player.makeDead();
            this.game.scene.switch('GameScene', 'DeadScene');
        }
    }

    private createPlayerAnims(): void {
        let anims = this.anims;
        this.anims.create(
            {
                key: 'front',
                frames: anims.generateFrameNumbers('characters', { start: 1, end: 1 })
                ,
                repeat: -1,
                frameRate: 5
            });

        this.anims.create(
            {
                key: 'front-run',
                frames: anims.generateFrameNumbers('characters', { frames: [0, 2] }),
                frameRate: 5
            });
    }
}