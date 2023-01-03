import { FileSystemFileHandle } from '.';

export interface ImportedFile {
  name: string;
  path: string;
  extension: string;
  fileSystemFileHandle: FileSystemFileHandle;
  fileData: any;
}
