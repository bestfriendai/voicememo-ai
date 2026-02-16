import { ContextState, PeriodicWaveConstraints, OfflineAudioContextOptions, AudioBufferSourceNodeOptions } from '../types';
import BaseAudioContext from './BaseAudioContext';
import AnalyserNode from './AnalyserNode';
import AudioDestinationNode from './AudioDestinationNode';
import AudioBuffer from './AudioBuffer';
import AudioBufferSourceNode from './AudioBufferSourceNode';
import BiquadFilterNode from './BiquadFilterNode';
import GainNode from './GainNode';
import OscillatorNode from './OscillatorNode';
import PeriodicWave from './PeriodicWave';
import StereoPannerNode from './StereoPannerNode';
export default class OfflineAudioContext implements BaseAudioContext {
    readonly context: globalThis.OfflineAudioContext;
    readonly destination: AudioDestinationNode;
    readonly sampleRate: number;
    constructor(options: OfflineAudioContextOptions);
    constructor(numberOfChannels: number, length: number, sampleRate: number);
    get currentTime(): number;
    get state(): ContextState;
    createOscillator(): OscillatorNode;
    createGain(): GainNode;
    createStereoPanner(): StereoPannerNode;
    createBiquadFilter(): BiquadFilterNode;
    createBufferSource(options?: AudioBufferSourceNodeOptions): Promise<AudioBufferSourceNode>;
    createBuffer(numOfChannels: number, length: number, sampleRate: number): AudioBuffer;
    createPeriodicWave(real: Float32Array, imag: Float32Array, constraints?: PeriodicWaveConstraints): PeriodicWave;
    createAnalyser(): AnalyserNode;
    decodeAudioDataSource(source: string): Promise<AudioBuffer>;
    decodeAudioData(arrayBuffer: ArrayBuffer): Promise<AudioBuffer>;
    startRendering(): Promise<AudioBuffer>;
    resume(): Promise<void>;
    suspend(suspendTime: number): Promise<void>;
}
//# sourceMappingURL=OfflineAudioContext.d.ts.map