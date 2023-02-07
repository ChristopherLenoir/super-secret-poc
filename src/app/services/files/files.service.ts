import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SoundFile } from '../../engine/types/interfaces';
import { getSoundFileAudioBuffer, processWaveForm, remapDataToTwoDimensionalMatrix } from '../../engine/utils';
import { FileSystemFileHandle } from '../../types';
import { AudioEngineService } from '../audio-engine/audio-engine.service';
import { CurrentFileService } from '../current-file/current-file.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private _filesSubject$: BehaviorSubject<SoundFile[]>;

  constructor(private audioEngineService: AudioEngineService, private currentFileService: CurrentFileService) {
    this._filesSubject$ = new BehaviorSubject<SoundFile[]>([]);
  }
  private get _files() {
    return this._filesSubject$.getValue();
  }

  async selectImportedFile(file: File): Promise<void> {
    const audioBuffer: AudioBuffer = await getSoundFileAudioBuffer(
      this.audioEngineService.audioEngine.masterContext,
      file
    );
    const processedWaveForm = await processWaveForm(audioBuffer);
    this.currentFileService.setCurrentFile({
      file: file,
      type: 'oneShot',
      volume: 1,
      audioBuffer: audioBuffer,
      processedWaveForm: processedWaveForm,
      remappedData: remapDataToTwoDimensionalMatrix(
        processedWaveForm.channel,
        processedWaveForm.stride,
        processedWaveForm.tickCount
      ).slice(0, processedWaveForm.stride / 2)
    });
  }

  private async _setFiles(files: File[]) {
    for (let i = 0; i < files.length; i++) {
      const audioBuffer: AudioBuffer = await getSoundFileAudioBuffer(
        this.audioEngineService.audioEngine.masterContext,
        files[i]
      );
      const processedWaveForm = await processWaveForm(audioBuffer);
      const res: SoundFile = {
        file: files[i],
        type: 'loop',
        volume: 1,
        audioBuffer: audioBuffer,
        processedWaveForm: processedWaveForm,
        remappedData: remapDataToTwoDimensionalMatrix(
          processedWaveForm.channel,
          processedWaveForm.stride,
          processedWaveForm.tickCount
        ).slice(0, processedWaveForm.stride / 2)
      };
      this._filesSubject$.next([...this._files, res]);

      // return res;
    }
    // this._filesSubject$.next(soundFiles);
  }

  private async _addFiles(files: File[]) {
    console.log('------------------------------------------------------------------');
    const startTime = performance.now();
    for (let i = 0; i < files.length; i++) {
      const fileStartTime = performance.now();
      const audioBuffer = await getSoundFileAudioBuffer(this.audioEngineService.audioEngine.masterContext, files[i]);
      const processedWaveForm = await processWaveForm(audioBuffer);
      const res: SoundFile = {
        file: files[i],
        type: 'loop',
        volume: 1,
        audioBuffer: audioBuffer,
        processedWaveForm: processedWaveForm,
        remappedData: remapDataToTwoDimensionalMatrix(
          processedWaveForm.channel,
          processedWaveForm.stride,
          processedWaveForm.tickCount
        ).slice(0, processedWaveForm.stride / 2)
      };
      this._filesSubject$.next([...this._files, res]);
      const fileEndTime = performance.now();
      // console.log('------------------------------------------------------------------');
      // console.log(`Call to _addFiles took ${fileEndTime - fileStartTime} milliseconds`);
      // console.log('res : ', res);
      // console.log('res.res.audioBuffer.getChannelData(0) : ', res.audioBuffer.getChannelData(0));
    }
    const endTime = performance.now();
    console.log(`Call to _addFiles took ${endTime - startTime} milliseconds`);
    console.log('------------------------------------------------------------------');
    // this._filesSubject$.next([...this._files, ...soundFiles]);
  }

  public get $files(): Observable<SoundFile[]> {
    return this._filesSubject$.asObservable();
  }

  // TO DO : Check if file is already open
  async openFileOrFiles(multiple = false) {
    // file extension check
    // file encoding and sampling rate minimum check

    // Feature detection. The API needs to be supported
    // and the app not run in an iframe.
    const supportsFileSystemAccess =
      'showOpenFilePicker' in window &&
      (() => {
        try {
          return window.self === window.top;
        } catch {
          return false;
        }
      })();

    // If the File System Access API is supported…
    if (supportsFileSystemAccess) {
      let fileOrFiles: FileSystemFileHandle[] = [];
      try {
        // Show the file picker, optionally allowing multiple files.
        fileOrFiles = await (window as any).showOpenFilePicker({ multiple });
      } catch (err) {
        // Fail silently if the user has simply canceled the dialog.
        if (err.name !== 'AbortError') {
          console.error(err.name, err.message);
        }
      }

      const filesToAdd: File[] = await Promise.all(
        fileOrFiles.map(async fileHandle => {
          return await fileHandle.getFile();
          // return {
          //   name: fileHandle.name,
          //   path: '',
          //   extension: fileHandle.name.substring(fileHandle.name.lastIndexOf('.') + 1, fileHandle.name.length),
          //   fileSystemFileHandle: fileHandle,
          //   // get file contents
          //   fileData: await fileHandle.getFile()
          // };
        })
      );

      await this._addFiles(filesToAdd);
    }

    // // Fallback if the File System Access API is not supported.
    // return new Promise(resolve => {
    //   // Append a new `<input type="file" multiple? />` and hide it.
    //   const input = document.createElement('input');
    //   input.style.display = 'none';
    //   input.type = 'file';
    //   document.body.append(input);
    //   if (multiple) {
    //     input.multiple = true;
    //   }
    //   // The `change` event fires when the user interacts with the dialog.
    //   input.addEventListener('change', () => {
    //     // Remove the `<input type="file" multiple? />` again from the DOM.
    //     input.remove();
    //     // If no files were selected, return.
    //     if (!input.files) {
    //       return;
    //     }
    //     // Return all files or just one file.
    //     resolve(multiple ? input.files : input.files[0]);
    //   });
    //   // // Show the picker.
    //   // if ('showPicker' in HTMLInputElement.prototype) {
    //   //   input.showPicker();
    //   // } else {
    //   //   input.click();
    //   // }
    // });
  }
}
