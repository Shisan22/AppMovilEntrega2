export class AudioSynth {
  private ctx: AudioContext | null = null;
  private activeNodes: (AudioNode | { stop: () => void, disconnect: () => void })[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
    }
  }

  stop() {
    this.activeNodes.forEach(node => {
      try {
        if ('stop' in node) (node as any).stop();
      } catch (e) {}
      try {
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
    this.isPlaying = false;
  }

  async play(type: string) {
    this.init();
    if (!this.ctx || !this.gainNode) return;
    
    this.stop();
    
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.isPlaying = true;
    this.gainNode.gain.value = 0.5; // Default volume

    switch (type) {
      case 'rain':
        this.playRain();
        break;
      case 'ocean':
        this.playOcean();
        break;
      case 'white-noise':
        this.playWhiteNoise();
        break;
      case 'bowl':
        this.playBowl();
        break;
      case 'birds':
        this.playBirds();
        break;
      case 'elevator':
        this.playElevator();
        break;
      default:
        this.playWhiteNoise();
    }
  }

  private createNoiseBuffer(): AudioBuffer {
    const bufferSize = this.ctx!.sampleRate * 2; // 2 seconds of noise
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private playRain() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    
    // Brown noise approximation
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Compensate gain
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();

    this.activeNodes.push(noise, filter);
  }

  private playOcean() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    
    // Brown noise approximation
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    // LFO for waves
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // 10 seconds per wave

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 400;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(this.gainNode);
    
    noise.start();
    lfo.start();

    this.activeNodes.push(noise, filter, lfo, lfoGain);
  }

  private playWhiteNoise() {
    if (!this.ctx || !this.gainNode) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer();
    noise.loop = true;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 3000;

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();

    this.activeNodes.push(noise, filter);
  }

  private playBowl() {
    if (!this.ctx || !this.gainNode) return;
    
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 432;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    
    // Slow attack and release loop
    const loopDuration = 4;
    
    const playNote = () => {
      if (!this.isPlaying || !this.ctx) return;
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 1);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + loopDuration);
      
      if (this.isPlaying) {
        setTimeout(playNote, loopDuration * 1000);
      }
    };

    osc.connect(gain);
    gain.connect(this.gainNode);
    osc.start();
    playNote();

    this.activeNodes.push(osc, gain);
  }

  private playBirds() {
    if (!this.ctx || !this.gainNode) return;
    
    const playChirp = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      const freq = 2000 + Math.random() * 2000;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq - 500, this.ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.02);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(this.gainNode);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
      
      this.activeNodes.push(osc, gain);
      
      if (this.isPlaying) {
        setTimeout(playChirp, Math.random() * 2000 + 500);
      }
    };
    
    playChirp();
  }

  private playElevator() {
    if (!this.ctx || !this.gainNode) return;
    
    const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C
    let noteIdx = 0;
    
    const playNote = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = notes[noteIdx];
      
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(this.gainNode);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
      
      this.activeNodes.push(osc, gain);
      
      noteIdx = (noteIdx + 1) % notes.length;
      
      if (this.isPlaying) {
        setTimeout(playNote, 500);
      }
    };
    
    playNote();
  }
}

export const audioSynth = new AudioSynth();
