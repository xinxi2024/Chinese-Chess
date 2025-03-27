// 音效管理工具类
class SoundEffects {
  constructor() {
    this.sounds = {};
    this.bgMusic = null;
    this.isMuted = false;
  }

  // 初始化音效
  async initSounds() {
    try {
      this.sounds = {
        move: new Audio('/sounds/capture.mp3'), // 暂用capture作为移动音效
        capture: new Audio('/sounds/capture.mp3'),
        check: new Audio('/sounds/check.mp3'),
        victory: new Audio('/sounds/victory.mp3'),
        defeat: new Audio('/sounds/defeat.mp3'),
        select: new Audio('/sounds/capture.mp3') // 暂用capture作为选择音效
      };
      
      this.bgMusic = new Audio('/sounds/background.mp3');
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0.3;

      // 预加载所有音效
      return Promise.all(
        Object.values(this.sounds).map(audio => {
          return new Promise(resolve => {
            audio.addEventListener('canplaythrough', resolve, { once: true });
            audio.load();
          });
        })
      );
    } catch (error) {
      console.error('加载音效失败:', error);
    }
  }

  // 播放音效
  playSound(soundName) {
    if (this.isMuted || !this.sounds[soundName]) return;
    
    try {
      const sound = this.sounds[soundName];
      sound.currentTime = 0;
      sound.play().catch(e => console.log('播放音效失败:', e));
    } catch (error) {
      console.error(`播放音效 ${soundName} 失败:`, error);
    }
  }

  // 播放背景音乐
  playBgMusic() {
    if (this.isMuted || !this.bgMusic) return;
    
    try {
      this.bgMusic.play().catch(e => console.log('播放背景音乐失败:', e));
    } catch (error) {
      console.error('播放背景音乐失败:', error);
    }
  }

  // 停止背景音乐
  stopBgMusic() {
    if (!this.bgMusic) return;
    
    try {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    } catch (error) {
      console.error('停止背景音乐失败:', error);
    }
  }

  // 静音/取消静音
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.bgMusic) {
      this.bgMusic.muted = this.isMuted;
    }
    
    Object.values(this.sounds).forEach(sound => {
      sound.muted = this.isMuted;
    });
    
    return this.isMuted;
  }
}

// 创建单例实例
const soundEffects = new SoundEffects();
export default soundEffects;

