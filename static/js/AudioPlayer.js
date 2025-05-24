// AudioPlayer.js

export class AudioPlayer {
    constructor(elements, audioUrl = null) {
      this.container = elements.container;
      this.wrapper = elements.wrapper;
      this.timeline = elements.timeline;
      this.progress = elements.progress;
      this.playButton = elements.playButton;
      this.stopButton = elements.stopButton;
  
      this.currentHowl = null;
      this.duration = 0;
      this.intervalId = null;
      this.mark = null;
      this.markerEl = null;
      this.audioID = null;
      this.volume = .5;
  
      // Привязка событий к кнопкам
      this.playButton.addEventListener('click', () => this.play());
      this.stopButton.addEventListener('click', () => this.stop());
      this.timeline.addEventListener('click', (e) => this.setMark(e));
  
      if (audioUrl) {
        this.change_audio(audioUrl);
      }
    }
  
    change_audio(url) {
      this.stop();
      if (this.currentHowl) {
        this.currentHowl.unload();
      }
  
      this.currentHowl = new Howl({
        src: [url],
        html5: true,
        volume: this.volume,
        onload: () => {
          this.duration = this.currentHowl.duration();
        },
        onend: () => {
          clearInterval(this.intervalId);
        }
      });
      this.clearMark();
      this.audioID = this.play();
    }
  
    play() {
      if (!this.currentHowl) return;
      // this.currentHowl.stop();
      this.audioID = this.currentHowl.play();
      console.log('play() this.audioID', this.audioID)

      this.startProgressTracking();
    }
  
    stop() {
      if (this.currentHowl) {
        this.currentHowl.stop();
      }
      clearInterval(this.intervalId);
      this.updateTimeline(0);
    }
    clear() {
        this.stop();
        this.clearMark();
        console.log('clear() this.audioID', this.audioID)
        this.audioID = null;
    }
    repeat() {
        this.stop();
        this.audioID = this.play();
    }
    setMark(event) {
      if (!this.currentHowl || !this.duration) return;
  
      const rect = this.timeline.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percent = clickX / rect.width;
      const time = percent * this.duration;
  
      this.mark = time;
      this.starttime = this.mark
      this.clearMark();
  
      this.markerEl = document.createElement('div');
      this.markerEl.className = 'marker';
      this.markerEl.style.left = `${percent * 100}%`;
      this.timeline.appendChild(this.markerEl);
  
      this.currentHowl.seek(time);
      this.audioID = this.play();
    }
  
    clearMark() {
      if (this.markerEl) {
        this.markerEl.remove();
        this.markerEl = null;
      }
      this.mark = null;
    }
 
    changeVolume(value) {
      this.volume = value;
      console.log('this.audioID', this.audioID);
      if (this.audioID) {
        this.currentHowl.volume(value, this.audioID);
      }
    }

    updateTimeline(currentTime) {
      const percent = (currentTime / this.duration) * 100;
      this.progress.style.width = percent + '%';
    }
  
    startProgressTracking() {
        clearInterval(this.intervalId);
        let lastTime = 0;
        let stuckCounter = 0;
      
        this.intervalId = setInterval(() => {
          const currentTime = this.currentHowl.seek();
      
          // Проверка на "залипание"
          if (currentTime === lastTime) {
            stuckCounter++;
          } else {
            stuckCounter = 0;
          }
      
          lastTime = currentTime;
          this.updateTimeline(currentTime);
      
          // Если значение залипает несколько раз подряд — добиваем до конца
          if (stuckCounter >= 3) {
            this.updateTimeline(this.duration);
            clearInterval(this.intervalId);
          }
      
        }, 100);
      }
      
  }
  
  // ✅ Отдельная экспортируемая функция
  export function createAudioPlayerHTML(container, audioUrl = null) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('createAudioPlayerHTML: container must be a valid DOM element');
    }
  
    const wrapper = document.createElement('div');
    wrapper.className = 'audio-player';
  
    const timeline = document.createElement('div');
    timeline.className = 'timeline';
  
    const progress = document.createElement('div');
    progress.className = 'progress';
    timeline.appendChild(progress);
  
    const playButton = document.createElement('button');
    playButton.textContent = '▶ Play';
  
    const stopButton = document.createElement('button');
    stopButton.textContent = '■ Stop';
  
    wrapper.appendChild(timeline);
    wrapper.appendChild(playButton);
    wrapper.appendChild(stopButton);
    container.appendChild(wrapper);
  
    // Создаём и возвращаем экземпляр плеера
    return new AudioPlayer({
      container,
      wrapper,
      timeline,
      progress,
      playButton,
      stopButton
    }, audioUrl);
  }
