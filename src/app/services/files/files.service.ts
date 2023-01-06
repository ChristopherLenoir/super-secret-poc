import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SoundFile } from '../../engine/types/interfaces';
import { getSoundFileAudioBuffer } from '../../engine/utils';
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

  private async _setFiles(value: File[]) {
    const soundFiles: SoundFile[] = await Promise.all(
      value.map(async file => {
        return {
          file: file,
          type: 'loop',
          volume: 1,
          audioBuffer: await getSoundFileAudioBuffer(this.audioEngineService.audioEngine.masterContext, file)
        } as SoundFile;
      })
    );
    this._filesSubject$.next(soundFiles);
  }

  private async _addFiles(value: File[]) {
    const soundFiles: SoundFile[] = await Promise.all(
      value.map(async file => {
        return {
          file: file,
          type: 'loop',
          volume: 1,
          audioBuffer: await getSoundFileAudioBuffer(this.audioEngineService.audioEngine.masterContext, file)
        } as SoundFile;
      })
    );
    this._filesSubject$.next([...this._files, ...soundFiles]);
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

  async selectImportedFile(file: File): Promise<void> {
    this.currentFileService.setCurrentFile({
      file: file,
      type: 'oneShot',
      volume: 1,
      audioBuffer: await getSoundFileAudioBuffer(this.audioEngineService.audioEngine.masterContext, file)
    });
  }
}
