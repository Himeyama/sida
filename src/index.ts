import { app, BrowserWindow } from 'electron';
// これにより、TypeScript は Forge の Webpack プラグインによって自動生成されるマジック定数を取得可能
// これは Electron アプリが Webpack にバンドルされたアプリコードをどこで探すかを指示する（開発中か本番環境かによります）
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

require("./ipc.ts")

// インストール/アンインストール時に Windows のショートカットを作成/削除する処理
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  // ブラウザウィンドウを作成
  const mainWindow = new BrowserWindow({
    // height: 600,
    // width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#F8F8F8',
      height: 48
    }
  });

  // アプリの index.html をロード
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // DevTools を開く
  // mainWindow.webContents.openDevTools();
};

// このメソッドは、Electron の初期化が終了し、ブラウザウィンドウを作成する準備ができたときに呼び出される
// 一部の API は、このイベントが発生した後でのみ使用可能
app.on('ready', createWindow);

// すべてのウィンドウが閉じられたときに終了します。ただし、macOS では例外的に、
// ユーザーが Cmd + Q で明示的に終了するまで、アプリケーションとそのメニューバーがアクティブなままになることが一般的
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // OS X では、ドックアイコンがクリックされて他のウィンドウが開いていないときに、
  // アプリ内でウィンドウを再作成することが一般的
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// このファイルには、アプリの特定のメインプロセスのコードを含めることが可能
// また、それらを別のファイルに置いてここでインポートすることも可能。