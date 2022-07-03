

export default interface MusicPlayer {
    currentMusic: Phaser.Sound.BaseSound

    addMusic(music: Phaser.Sound.BaseSound): MusicPlayer
    playNextMusic(): void
}