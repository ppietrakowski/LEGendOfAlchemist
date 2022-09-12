import MusicPlayer from './MusicPlayer'


export default class DefaultMusicPlayer implements MusicPlayer {
    currentMusic: Phaser.Sound.BaseSound

    private readonly _music: Phaser.Sound.BaseSound[] = []
    private _currentMusicIndex = 0

    private startPlayMusic(): void {
        this.currentMusic = this._music[this._currentMusicIndex]
        this.currentMusic.once(Phaser.Sound.Events.STOP, this.playNextMusic, this)
        this.currentMusic.play({ volume: 0.2 })
    }

    addMusic(music: Phaser.Sound.BaseSound): this {
        this._music.push(music)

        if (!this.currentMusic)
            this.startPlayMusic()

        return this
    }

    playNextMusic(): void {
        this._currentMusicIndex++

        if (this._currentMusicIndex === this._music.length)
            this._currentMusicIndex = 0

        this.startPlayMusic()
    }
}