const { contextBridge, ipcRenderer } = require("electron");

console.log("HI FROM PRELOAD");

contextBridge.exposeInMainWorld("myAPI", {
  getRecentURL: (callback) => {
    ipcRenderer.on("get-recent-url", (e, data) => {
      callback(data);
    });
  },
});
