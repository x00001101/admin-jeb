// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jeb", {
  printAawb: async (id) => {
    ipcRenderer.send("printAwb", id);
  },
  getGlobalVar: async (variable) => {
    const result = await ipcRenderer.invoke("getGlobalVar", variable);
    return result;
  },
  setSettingPrinter: async (object) => {
    const result = await ipcRenderer.invoke("setSettingPrinter", object);
    return result;
  },
  getSettingPrinter: async () => {
    const result = await ipcRenderer.invoke("getSettingPrinter");
    return result;
  }
});
