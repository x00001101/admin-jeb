// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge } = require("electron");

const { print, getDefaultPrinter } = require("pdf-to-printer");
const fs = require("fs");

contextBridge.exposeInMainWorld("electron", {
  doPrint: () => {
    print("temp/tes.pdf").then((data) => console.log(data));
  },
  doGetDefaultPrinter: () => {
    getDefaultPrinter().then(console.log);
  },
  savePdf: (data) => {
    try {
      fs.writeFileSync("file.pdf", data);
      console.log("Success in writing file");
    } catch (err) {
      console.log("Error in writing file");
      console.log(err);
    }
  },
});
