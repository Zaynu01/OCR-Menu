const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 400,
    resizable: true,
    webPreferences: {
      nodeIntegration: false, // For security reasons, it's recommended to leave this as false
      contextIsolation: true, // Security feature to keep the renderer process isolated from the main process
      preload: path.join(__dirname, 'preload.js') // Optional: you can use a preload script if necessary
    },
    icon: path.join(__dirname, 'public', 'favicon.ico'), // Ensure the correct path for favicon
    titleBarStyle: 'default', // This ensures default title bar behavior
    show: false // Prevent showing window until it is ready
  });

  // Load the app based on the environment
  if (process.env.NODE_ENV === 'development') {
    // Development environment: Load URL from local server (e.g., for React, Vue, etc.)
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools(); // Automatically open dev tools in development
  } else {
    // Production environment: Load the local HTML file
    mainWindow.loadFile(path.join(__dirname, 'index1.html'));
  }

  // Show the window once it's ready to avoid visual flashes
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Close the app when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null; // Dereference the window object
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit(); // Properly quit the app when all windows are closed
  }
});

// On macOS, re-create a window when clicking the dock icon (if there are no open windows)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow(); // Re-create the window if none exist
  }
});
