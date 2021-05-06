const { app, BrowserWindow } = require('electron')
const path = require('path')
const {startServer} = require("./server");

function createWindow () {
    const win = new BrowserWindow({
        width: 700,
        height: 200,
        resizable: false,
        icon: "./assets/laToqueLogo.ico",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    win.loadFile('index.html')
    return win;
}

app.whenReady().then(() => {
    let win = createWindow()
    startServer(win);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

