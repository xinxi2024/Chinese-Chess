// 音效管理工具类
class SoundEffects {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.sounds = {};
    this.bgMusic = null;
    this.isBgMusicPlaying = false;
  }

  // 加载音效
  async loadSound(name, url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds[name] = audioBuffer;
    } catch (error) {
      console.error(`Failed to load sound: ${name}`, error);
    }
  }

  // 播放音效
  playSound(name) {
    if (this.sounds[name]) {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.sounds[name];
      source.connect(this.audioContext.destination);
      source.start(0);
    }
  }

  // 播放背景音乐
  playBgMusic() {
    if (!this.isBgMusicPlaying && this.sounds['bgMusic']) {
      this.bgMusic = this.audioContext.createBufferSource();
      this.bgMusic.buffer = this.sounds['bgMusic'];
      this.bgMusic.loop = true;
      this.bgMusic.connect(this.audioContext.destination);
      this.bgMusic.start(0);
      this.isBgMusicPlaying = true;
    }
  }

  // 停止背景音乐
  stopBgMusic() {
    if (this.bgMusic && this.isBgMusicPlaying) {
      this.bgMusic.stop();
      this.isBgMusicPlaying = false;
    }
  }

  // 初始化所有音效
  async initSounds() {
    await Promise.all([
      this.loadSound('capture', '/sounds/capture.mp3'),
      this.loadSound('check', '/sounds/check.mp3'),
      this.loadSound('victory', '/sounds/victory.mp3'),
      this.loadSound('defeat', '/sounds/defeat.mp3'),
      this.loadSound('bgMusic', '/sounds/background.mp3')
    ]);
  }
}

// 创建单例实例
const soundEffects = new SoundEffects();
export default soundEffects;
