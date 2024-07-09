// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('dir', {
  entries: (dir: string) => ipcRenderer.invoke('dir:entries', dir),
  exist: (dir: string) => ipcRenderer.invoke('dir:exist', dir),
});

contextBridge.exposeInMainWorld('file', {
  exist: (fileName: string) => ipcRenderer.invoke('file:exist', fileName),
  openread: (fileName: string) => ipcRenderer.invoke('file:openread', fileName),
  mimeType: (fileName: string) => ipcRenderer.invoke('file:mimeType', fileName),
  mtime: (fileName: string) => ipcRenderer.invoke('file:mtime', fileName),
});

contextBridge.exposeInMainWorld('openfile', {
  dialog: () => ipcRenderer.invoke('filedialog:open'),
});

contextBridge.exposeInMainWorld('app', {
  exit: () => ipcRenderer.invoke('app:exit'),
});
