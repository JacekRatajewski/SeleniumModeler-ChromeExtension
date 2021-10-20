const { app, BrowserWindow } = require('electron');
const path = require("path");
function createWindow() {
    const win = new BrowserWindow({
        width: 300,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })

    win.loadFile(path.resolve(__dirname, 'index.html'))
}
app.whenReady().then(() => {
    createWindow();
})
