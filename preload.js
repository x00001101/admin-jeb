// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jeb", {
  printAawb: async (id) => {
    ipcRenderer.send("printAwb", id);
  },
  getPath: async () => {
    // ipcRenderer.send("getGlobalVar", "path");
    const result = await ipcRenderer.invoke("getGlobalVar", "path");
    return result;
    // await ipcRenderer.on("receiveGlobalVar", (event, arg) => {
      
    // });
  }
}); 
