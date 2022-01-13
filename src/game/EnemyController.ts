import Phaser from "phaser";
import Character from "./Character";
import Component from "./Component";
import Enemy from "./Enemy";
import Player from './Player'
import SimplexNoise from 'simplex-noise'

const noise = new SimplexNoise();

enum AI_State {
    Roaming,
    DuringMove,
    Chasing,
    Attack,
    Aborted,
    BackToStart
}

function getRandomVector(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(noise.noise2D(-1, 1), 
    noise.noise2D(-1, 1));
}

enum Direction {
    Left,
    Right,
    Up,
    Down
}

function getRandomDir(): Direction {
    switch (Math.ceil(Math.random() * 4)) {
        case 0:
            return Direction.Left;
        case 1:
            return Direction.Right;
        case 2:
            return Direction.Up
        case 3:
            return Direction.Down
    }
}
export default class EnemyController implements Component {
    target: Player;
    self: Enemy;
    state: AI_State;
    startPos: Phaser.Math.Vector2;
    endPos: Phaser.Math.Vector2;
    dir: Direction
    constructor(target: Player) {
        this.target = target;
        this.state = AI_State.Roaming;
    }

    debugName(): string {
        return 'Enemy Movement';
    }

    getName(): string {
        return 'enemy-movement';
    }

    start(character: Character): void {
        this.self = character;
        this.startPos = new Phaser.Math.Vector2(character.sprite.x, character.sprite.y);
    }

    update(timeSinceLastFrame: number): void {
        
        if (this.state === AI_State.Roaming) {
            let newPos = this.getNextPosition(timeSinceLastFrame);
            this.self.sprite.scene.tweens.add({
                targets: [this.self.sprite],
                duration: 10,
                x: newPos.x,
                y: newPos.y,
                onComplete: () => { this.state = AI_State.Roaming; }
            })
            this.state = AI_State.DuringMove;
            this.endPos = newPos;
        }
    }

    // TODO CHANGE ALGORITHM
    getNextPosition(timeSinceLastFrame: number): Phaser.Math.Vector2 {
        this.dir = getRandomDir();
        let v = new Phaser.Math.Vector2(1, 1);

        if (this.dir === Direction.Up) {
            v.y *= noise.noise2D(0.1, 1) * 100 * timeSinceLastFrame;
            v.y += this.self.sprite.y;
            v.x = this.self.sprite.x;
        }

        else if (this.dir === Direction.Down) {
            v.y *= noise.noise2D(0.1, 1) * -100 * timeSinceLastFrame;
            v.y += this.self.sprite.y;
            v.x = this.self.sprite.x;
        }

        else if (this.dir == Direction.Left) {
            v.x *= noise.noise2D(0.1, 1) * -100 * timeSinceLastFrame;
            v.x += this.self.sprite.x;
            v.y = this.self.sprite.y;
        } else {
            v.x *= noise.noise2D(0.1, 1) * 100 * timeSinceLastFrame;
            v.x += this.self.sprite.x;
            v.y = this.self.sprite.y;
        }

        return v;
    }
}