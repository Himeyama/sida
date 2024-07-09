export interface IDir {
    entries: (dir: string) => Promise<any>;
    exist: (dir: string) => Promise<boolean>;
}

export interface IApp {
    exit: () => Promise<void>;
}

export interface IFile {
    exist: (dir: string) => Promise<boolean>
    openread: (fileName: string) => Promise<any>
    mimeType: (fileName: string) => Promise<string>
    mtime: (fileName: string) => Promise<number>
}

export interface IOpenFile {
    dialog: () => Promise<any>;
}

declare global{
    interface Window {
        file: IFile
        openfile: IOpenFile
        app: IApp
        dir: IDir
    }
}
