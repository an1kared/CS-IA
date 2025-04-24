const { ipcRenderer } = require('electron');
const { BrowserWindow } = require('electron');

document.addEventListener('DOMContentLoaded', () => {    

const loginForm = document.querySelector('.loginForm')
    console.log(loginForm)
    loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('submitted')
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    ipcRenderer.send('login:submit', { email, password });
    console.log('sent')
});




ipcRenderer.on('login:error', (event, errorMessage) => {
    // Display an error message to the user or handle it in your UI
    console.log(errorMessage);
    message.textContent = 'Email or password is incorrect!'      
})

})