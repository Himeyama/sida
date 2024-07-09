import { app, ipcMain, dialog } from 'electron' // モジュールのインポート
import fs from 'fs' // fsモジュールのインポート
import mime from 'mime-types' // mimeモジュールのインポート
import path from 'node:path' // pathモジュールのインポート


ipcMain.on('exit', (_event: Electron.IpcMainEvent) => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('app:exit', (_event: Electron.IpcMainInvokeEvent) => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('dir:entries', (_event: Electron.IpcMainInvokeEvent, dir: string) => {
  try {
    const files: string[] = fs.readdirSync(dir) // ファイル一覧を取得
    return files
  } catch (err) {
    return err
  }
})

ipcMain.handle('filedialog:open', async (_event: Electron.IpcMainInvokeEvent) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({})
  if (!canceled) {
    return filePaths[0]
  }
  return null
})

ipcMain.handle('file:exist', (_event: Electron.IpcMainInvokeEvent, file: string) => {
  return fs.existsSync(file) // ファイルの存在チェック
})

ipcMain.handle('file:mimeType', (_event: Electron.IpcMainInvokeEvent, file: string) => {
  const ext = path.extname(file)
  const mimeType = mime.lookup(ext) // MIMEタイプを取得
  return mimeType
})

ipcMain.handle('file:mtime', (_event: Electron.IpcMainInvokeEvent, file: string) => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file)
    return Math.floor(stats.mtimeMs) // ファイルの最終更新時刻を取得
  }
  return null
})

ipcMain.handle('dir:exist', (_event: Electron.IpcMainInvokeEvent, dir: string) => {
  return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory() // ディレクトリの存在チェック
})

ipcMain.handle('file:openread', (_event: Electron.IpcMainInvokeEvent, file: string) => {
  if (fs.existsSync(file)) {
    const binaryData = fs.readFileSync(file)
    const base64Data = binaryData.toString('base64') // ファイルをBase64エンコードして返す
    return base64Data
  }
  return false
})
