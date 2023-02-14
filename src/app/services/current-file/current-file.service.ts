import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SoundPlayer } from '../../engine/core/SoundPlayer.class';
import { ProcessedFFTData, SoundFile } from '../../engine/types/interfaces';
import { AudioEngineService } from '../audio-engine/audio-engine.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentFileService {
  private _isThereAFileSelectedSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _currentFileSubject$: BehaviorSubject<SoundFile> = new BehaviorSubject<SoundFile>({} as SoundFile);

  // private _audioEngine: AudioEngine = new AE.AudioEngine();
  private _soundPlayer: SoundPlayer = this.audioEngineService.audioEngine.createSoundPlayer('soundPlayer', {});

  constructor(private audioEngineService: AudioEngineService) {}

  private get _currentFile(): SoundFile {
    return this._currentFileSubject$.getValue();
  }

  private set _currentFile(value: SoundFile) {
    this._currentFileSubject$.next(value);
  }

  public get currentFile$(): Observable<SoundFile> {
    return this._currentFileSubject$.asObservable();
  }

  // TO DO : remove file from array ( file and audio ) when removing a file from the app file list

  public async setCurrentFile(file: SoundFile): Promise<void> {
    this._soundPlayer.stopSounds();

    this._currentFile = file;
    // this._soundPlayer = this.audioEngineService.audioEngine.createSoundPlayer('soundPlayer', {
    //   [this._currentFile.file.name]: {
    //     file: file,
    //     type: 'oneShot',
    //     volume: 1
    //   }
    // });
    this._soundPlayer.addSoundToLibrary(this._currentFile.file.name, {
      file: this._currentFile.file,
      type: 'oneShot',
      volume: 1,
      audioBuffer: this._currentFile.audioBuffer,
      processedFFTData: this._currentFile.processedFFTData,
      remappedData: this._currentFile.remappedData
    });
    console.log('this.audioEngineService.audioEngine : ', this.audioEngineService.audioEngine);
    console.log(
      "this.audioEngineService.audioEngine.getChannelStrip('processing') : ",
      this.audioEngineService.audioEngine.getChannelStrip('processing')
    );
    this._soundPlayer.connect(this.audioEngineService.audioEngine.getChannelStrip('processing').input);

    this._currentFileSubject$.next(file);
    this._isThereAFileSelectedSubject$.next(true);
  }

  private get _isThereAFileSelected(): boolean {
    return this._isThereAFileSelectedSubject$.getValue();
  }

  private set _isThereAFileSelected(value: boolean) {
    this._isThereAFileSelectedSubject$.next(value);
  }

  public get isThereAFileSelected$(): Observable<boolean> {
    return this._isThereAFileSelectedSubject$.asObservable();
  }

  public get isPlaying$(): Observable<boolean> {
    return this._soundPlayer.isPlaying$;
  }

  // public async getSoundCursor(): Promise<Observable<number>> {
  //   return this._soundPlayer.getSoundCursor(this._currentFile.file.name);
  // }

  public getSoundDuration(): number {
    return this._soundPlayer.getSoundDuration(this._currentFile.file.name);
  }

  public getStartedAt(): number {
    return this._soundPlayer.getStartedAt(this._currentFile.file.name);
  }

  public getPausedAt(): number {
    return this._soundPlayer.getPausedAt(this._currentFile.file.name);
  }

  public getPlaybackRate(): number {
    return this._soundPlayer.getPlaybackRate(this._currentFile.file.name);
  }

  public getAudioBuffer(): AudioBuffer {
    return this._soundPlayer.getSoundBuffer(this._currentFile.file.name);
  }

  public getProcessedFFTData(): ProcessedFFTData {
    return this._soundPlayer.getProcessedFFTData(this._currentFile.file.name);
  }

  public getRemappedData(): number[][] {
    return this._soundPlayer.getRemappedData(this._currentFile.file.name);
  }

  play() {
    this._soundPlayer.playSound(this._currentFile.file.name);
  }

  pause() {
    this._soundPlayer.pauseSound(this._currentFile.file.name);
  }

  stop() {
    this._soundPlayer.stopSound(this._currentFile.file.name);
  }
}
