/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
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
