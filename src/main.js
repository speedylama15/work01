const { app, BrowserWindow } = require("electron");
const path = require("node:path");

import { createServer } from "../server/server";
import initializeApp from "./initializeApp";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      // FIX
      webSecurity: false,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  console.log("app is ready");
  // FIX
  await createServer();
  const configData = await initializeApp();
  const mainWindow = await createWindow();

  // FIX
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("get-recent-url", configData);
  });

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
