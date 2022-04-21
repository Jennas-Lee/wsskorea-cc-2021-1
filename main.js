const electron = require('electron');
const ssh = require('node-ssh-forward');

const {app, BrowserWindow, ipcMain} = electron;
const {SSHConnection} = ssh;

let win;
let sshConnection;

const createWindow = () => {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.setMenu(null);

    win.loadFile('./static/html/index.html');
    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

ipcMain.on('startBtnClick', (event) => {
    event.sender.send('start-scoring');
});

ipcMain.on('getBastionServerSSH', async (event, payload) => {
    let sshOption = {}

    sshOption['endHost'] = payload['host'];
    sshOption['username'] = 'user';
    if (payload['option'] === 1) {
        sshOption['password'] = payload['password'];
    } else if (payload['option'] === 2) {
        sshOption['privateKey'] = payload['keypair'];
    }

    sshConnection = new SSHConnection(sshOption);

    await sshConnection.executeCommand('ps')
        .then(() => {
            sshConnection.executeCommand('aws --version')
                .then(value => {
                    console.log(value);
                })
                .catch(err => {
                    console.error(err);
                })
            event.sender.send('ready-bastion-server');
        })
        .catch(err => {
            sshConnection.shutdown();
            if (err.message === 'Timed out while waiting for handshake') {
                event.sender.send('connection-failed-bastion-server', {'type': 1});
            } else if (err.message === 'All configured authentication methods failed') {
                event.sender.send('connection-failed-bastion-server', {'type': 2});
            } else {
                console.log(err.message);
                event.sender.send('connection-failed-bastion-server', {'type': 3});
            }
        });
});
