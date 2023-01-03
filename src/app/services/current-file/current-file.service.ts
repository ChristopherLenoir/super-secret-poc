import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SoundPlayer } from '../../engine/core/SoundPlayer.class';
import { AudioEngineService } from '../audio-engine/audio-engine.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentFileService {
  private _isThereAFileSelectedSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _currentFileSubject$: BehaviorSubject<File> = new BehaviorSubject<File>({} as File);

  // private _audioEngine: AudioEngine = new AE.AudioEngine();
  private _soundPlayer: SoundPlayer = this.audioEngineService.audioEngine.createSoundPlayer('soundPlayer', {});

  constructor(private audioEngineService: AudioEngineService) {}

  private get _currentFile() {
    return this._currentFileSubject$.getValue();
  }

  private set _currentFile(value: File) {
    this._currentFileSubject$.next(value);
  }

  public get currentFile$(): Observable<File> {
    return this._currentFileSubject$.asObservable();
  }

  // TO DO : remove file from array ( file and audio ) when removing a file from the app file list

  public async setCurrentFile(file: File): Promise<void> {
    this._soundPlayer.stopSounds();

    this._currentFile = file;
    // this._soundPlayer = this.audioEngineService.audioEngine.createSoundPlayer('soundPlayer', {
    //   [this._currentFile.name]: {
    //     file: file,
    //     type: 'oneShot',
    //     volume: 1
    //   }
    // });
    this._soundPlayer.addSoundToLibrary(this._currentFile.name, {
      file: file,
      type: 'oneShot',
      volume: 1
    });
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
  //   return this._soundPlayer.getSoundCursor(this._currentFile.name);
  // }

  public async getSoundDuration(): Promise<number> {
    return this._soundPlayer.getSoundDuration(this._currentFile.name);
  }

  public async getStartedAt(): Promise<number> {
    return this._soundPlayer.getStartedAt(this._currentFile.name);
  }

  public async getPlaybackRate(): Promise<number> {
    return this._soundPlayer.getPlaybackRate(this._currentFile.name);
  }

  public async getAudioBuffer(): Promise<AudioBuffer> {
    return this._soundPlayer.getSoundBuffer(this._currentFile.name);
  }

  play() {
    this._soundPlayer.playSound(this._currentFile.name);
  }

  pause() {
    this._soundPlayer.pauseSound(this._currentFile.name);
  }

  stop() {
    this._soundPlayer.stopSound(this._currentFile.name);
  }
}
