/**
 * このファイルは自動的に webpack によって読み込まれ、"renderer" コンテキストで実行される
 * Electron の "main" と "renderer" コンテキストの違いについて詳しく知るには、以下を参照されたい
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * デフォルトでは、このファイルでは Node.js の統合は無効化される。
 * レンダラープロセスで Node.js の統合を有効にするときは、潜在的なセキュリティの影響を理解すること。
 * セキュリティリスクについての詳細は以下のリンクを参照されたい
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * このファイルで Node.js の統合を有効にするには、`main.js` を開き、`nodeIntegration` フラグを有効にする:
 *
 * ```
 *  // ブラウザウィンドウを作成
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import { provideFluentDesignSystem, fluentMenu, fluentMenuItem } from '@fluentui/web-components';

provideFluentDesignSystem()
    .register(
        fluentMenu(),
        fluentMenuItem()
    );

import './index.css';


class Menu {
    static visibled: boolean = false;
    menuButton: HTMLDivElement | null;

    constructor() {
        this.menuButton = null;
    }

    // メニューを閉じる
    static closeMenu = () => {
        const menuList = document.getElementById("menu-list")?.children;
        if (!menuList) return
        for (const menu of Array.from(menuList)) {
            if (menu.classList.contains("visibled")) {
                menu.classList.remove("visibled");
            }
        }
        Menu.visibled = false;
    };

    // メニュー追加
    addMenuItem = (itemName: string, uid: string): HTMLDivElement | null => {
        this.menuButton = document.createElement("div");
        this.menuButton.innerText = itemName;
        this.menuButton.classList.add("menu-button-component");
        this.menuButton.id = `button-${uid}`;
        document.getElementById("menu-button")?.appendChild(this.menuButton);

        const menu = document.getElementById(`menu-${uid}`);
        if (menu == null) return this.menuButton;

        menu.style.left = `${this.menuButton.offsetLeft}px`;

        const menuVisible = (mouseover: boolean) => {
            if (menu.classList.contains("visibled")) {
                if (!mouseover) {
                    menu.classList.remove("visibled");
                }
            } else {
                Menu.closeMenu();
                menu.classList.add("visibled");
                Menu.visibled = true;
            }
        };

        this.menuButton.addEventListener("click", () => {
            menuVisible(false);
        });

        this.menuButton.addEventListener("mouseover", () => {
            if (Menu.visibled) menuVisible(true);
        });

        return this.menuButton;
    };
}

// ウィンドウ内をクリックしたとき
document.addEventListener("click", (e) => {
    console.log(e);
    const elem: HTMLElement = e.target as HTMLElement
    if (elem == null) return;
    if (!elem.classList.contains("menu-button-component")) {
        Menu.closeMenu();
        return;
    }
});

const menuFile = new Menu();
menuFile.addMenuItem("ファイル", "file");

const menuEdit = new Menu();
menuEdit.addMenuItem("編集", "edit");

// ファイルを開く
const openFileButton = document.getElementById("openfile");
openFileButton?.addEventListener("click", async () => {
    const filePath = await window.openfile.dialog();
    const txt = await openFile(filePath);
    console.log(txt);
});

// 終了
const exitAppButton = document.getElementById("exit-app");
exitAppButton?.addEventListener("click", () => {
    window.app.exit()
});

const openFile = async (fileName: string): Promise<File> => {
    const base64Data = await window.file.openread(fileName);
    const byteCharacters = atob(base64Data);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    let mimeType = await window.file.mimeType(fileName);
    if (!mimeType) mimeType = "text/plain";

    // Blobを使用してファイルオブジェクトを作成
    const blob = new Blob(byteArrays);

    const mtime = await window.file.mtime(fileName);
    const fileObject = new File([blob], fileName, { type: mimeType, lastModified: mtime });
    fileObject.path = fileName;

    return fileObject;
};
