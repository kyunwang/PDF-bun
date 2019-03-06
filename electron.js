const path = require('path');
const { app, BrowserWindow, ipcMain, shell, Menu, TouchBar } = require('electron');
const { TouchBarButton, TouchBarLabel, TouchBarSpacer } = TouchBar;

const isDev = require('electron-is-dev');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
	// Create browser window
	mainWindow = new BrowserWindow({
		backgroundColor: '#f7f7f7',
		minWidth: 800,
		minHeight: 600,
		show: false,
		titleBarStyle: 'hidden',
		webPreferences: {
			// nodeIntegration: false,
			// preload: __dirname
		},
	});

	// Load index.html of the app
	// mainWindow.loadFile(path.resolve(__dirname, 'src/index.html'));
	mainWindow.loadURL(
		isDev ? 'http://localhost:4050' : `file://${path.join(__dirname, 'dist/index.html')}`
	);

	if (isDev) {
		const {
			default: installExtension,
			REACT_DEVELOPER_TOOLS,
			REDUX_DEVTOOLS,
		} = require('electron-devtools-installer');

		// installExtension(REACT_DEVELOPER_TOOLS)
		// 	.then(name => console.log(`Added Extention: ${name}`))
		// 	.catch(err => console.error(`An error occurred: ${err}`));

		// installExtension(REDUX_DEVTOOLS)
		// .then(name => console.log(`Added Extention: ${name}`))
		// .catch(err => console.error(`An error occurred: ${err}`));
	}

	// Emitted when window is closed
	mainWindow.on('closed', () => {
		// Dereference window object
		mainWindow = null;
	});

	// Show window once it is ready
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();

		//
		ipcMain.on('open-external-window', (event, arg) => {
			shell.openExternal(arg);
		});
	});
}

function generateMenu() {
	const template = [
		{
			label: 'File',
			submenu: [{ role: 'About' }, { role: 'quit' }],
		},
	];

	Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// Electron finished initialization
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// (dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
		generateMenu();
	}
});

//
ipcMain.on('load-page', (event, arg) => {
	mainWindow.loadURL(arg);
});
