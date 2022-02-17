// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const editJsonFile = require("edit-json-file");

const isWin = process.platform === "win32";

let requirePrinter = "pdf-to-printer";
if (!isWin) {
  requirePrinter = "unix-print";
}

const { print, getDefaultPrinter } = require(requirePrinter);

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // width: 800,
    // height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  mainWindow.maximize();
  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  //get printersetting

  const url = "https://sandbag.jeb-deploy.com";
  ipcMain.on("printAwb", (event, id) => {
    const filePath = `temp/${id}.pdf`;
    const writer = fs.createWriteStream(filePath);
    axios({
      method: "GET",
      url: `${url}/createPdfAwb?id=${id}`,
      responseType: "stream",
    }).then((response) => {
      return new Promise((resolve, reject) => {
        response.data.pipe(writer);
        let error = null;
        writer.on("error", (err) => {
          error = err;
          writer.close();
          reject(err);
        });
        writer.on("close", async () => {
          if (!error) {
            resolve(true);
            // const option = ["-o fit-to-page", "-o page-left=-15"];
            // const prin = await print(filePath, "zebri", option);
            var pr;
            if (isWin) { 
              let settings = JSON.parse(fs.readFileSync("setting.json"));
              let settingPrinter = settings.settingPrinterWin32;
              let options = {
                orientation: settingPrinter.orientation,
                scale: settingPrinter.scale,
                monochrome: settingPrinter.monochrome
              };
              if (settingPrinterWin32.printer !== "") {
                options.printer = settingPrinter.printer
              }
              pr = await print(filePath, options);
            } else {
              let opt = ["-o landscape", "-o fit-to-page"];
              pr = await print(filePath, "zebri", opt);
            }
            console.log(pr);
          }
        });
      });
    });
  });

  ipcMain.handle("setSettingPrinter", (event, object) => {    
    const file = editJsonFile(`setting.json`);
    file.set("settingPrinterWin32.printer", object.printer);
    file.set("settingPrinterWin32.orientation", object.orientation);
    file.set("settingPrinterWin32.scale", object.scale);
    file.set("settingPrinterWin32.monochrome", object.monochrome);
    file.save();
    return "Setting Saved!";
  });

  ipcMain.handle("getSettingPrinter", (event) => {
    let settings = JSON.parse(fs.readFileSync("setting.json"));
    let settingPrinter = settings.settingPrinterWin32;
    return settingPrinter;
  });

  var mainProcess = {
    path: app.getAppPath(),
    platform: process.platform,
  };

  ipcMain.handle("getGlobalVar", (event, arg) => {
    let result = mainProcess[arg];
    if (arg === "path" && mainProcess["platform"] === "win32") {
      // result = "/" + result.replace(/\\/, "/");
      result = result.split(path.sep);
      result = result.join("/");
      result = "/" + result;
    }
    return result;
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
