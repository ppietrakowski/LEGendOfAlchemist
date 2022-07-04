import MusicPlayer from "./MusicPlayer";


export default class DefaultMusicPlayer implements MusicPlayer {
    currentMusic: Phaser.Sound.BaseSound;

    private readonly music: Phaser.Sound.BaseSound[] = []
    private currentMusicIndex = 0

    constructor() {
    }

    addMusic(music: Phaser.Sound.BaseSound): MusicPlayer {
        this.music.push(music)

        if (!this.currentMusic)
            this.startPlayMusic()

        return this
    }

    playNextMusic(): void {
        this.currentMusicIndex++

        if (this.currentMusicIndex === this.music.length)
            this.currentMusicIndex = 0

        this.startPlayMusic()
    }

    private startPlayMusic(): void {
        this.currentMusic = this.music[this.currentMusicIndex]
        this.currentMusic.once(Phaser.Sound.Events.STOP, this.playNextMusic, this)
        this.currentMusic.play({ volume: 0.2 })
    }

}