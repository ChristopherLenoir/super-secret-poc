export enum ChooseFileSystemEntriesType {
  'open-file',
  'save-file',
  'open-directory'
}

export interface ChooseFileSystemEntriesOptionsAccepts {
  description?: string;
  mimeTypes?: string;
  extensions?: string;
}

export interface ChooseFileSystemEntriesOptions {
  type?: ChooseFileSystemEntriesType;
  multiple?: boolean;
  accepts?: ChooseFileSystemEntriesOptionsAccepts[];
  excludeAcceptAllOption?: boolean;
}

export interface FileSystemHandlePermissionDescriptor {
  writable?: boolean;
}

export interface FileSystemCreateWriterOptions {
  keepExistingData?: boolean;
}

export interface FileSystemGetFileOptions {
  create?: boolean;
}

export interface FileSystemGetDirectoryOptions {
  create?: boolean;
}

export interface FileSystemRemoveOptions {
  recursive?: boolean;
}

export enum SystemDirectoryType {
  'sandbox'
}

export interface GetSystemDirectoryOptions {
  type: SystemDirectoryType;
}

export interface FileSystemWriter {
  write(position: number, data: BufferSource | Blob | string): Promise<void>;
  truncate(size: number): Promise<void>;
  close(): Promise<void>;
}

export interface FileSystemWriterConstructor {
  new (): FileSystemWriter;
}

export interface FileSystemHandle {
  isFile: Readonly<boolean>;
  isDirectory: Readonly<boolean>;
  name: Readonly<string>;
  queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
  requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
}

export interface FileSystemHandleConstructor {
  new (): FileSystemHandle;
}

export interface FileSystemFileHandle extends FileSystemHandle {
  getFile(): Promise<File>;
  createWriter(options?: FileSystemCreateWriterOptions): Promise<FileSystemWriter>;
}

export interface FileSystemFileHandleConstructor {
  new (): FileSystemFileHandle;
}

export interface FileSystemDirectoryHandle extends FileSystemHandle {
  getFile(name: string, options?: FileSystemGetFileOptions): Promise<FileSystemFileHandle>;
  getDirectory(name: string, options?: FileSystemGetDirectoryOptions): Promise<FileSystemDirectoryHandle>;
  getEntries(): AsyncIterable<FileSystemFileHandle | FileSystemDirectoryHandle>;
  removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void>;
}

export interface FileSystemDirectoryHandleConstructor {
  new (): FileSystemDirectoryHandle;
  getSystemDirectory(options: GetSystemDirectoryOptions): Promise<FileSystemDirectoryHandle>;
}
