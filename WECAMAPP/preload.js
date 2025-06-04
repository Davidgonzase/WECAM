const { contextBridge, ipcRenderer } = require('electron');

console.log("Loaded")

contextBridge.exposeInMainWorld('electronAPI', {
  onConfig: (callback) => {
    ipcRenderer.on('config', (event, data) => {
      callback(data);
    });
  }
});