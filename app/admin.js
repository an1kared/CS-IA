const { ipcRenderer } = require('electron');

document.querySelector('.loginform').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('submitted')
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    ipcRenderer.send('admin:submit', { email, password });
    console.log('sent')
});


ipcRenderer.on('admin:error', (event, errorMessage) => {  
    console.log(errorMessage);
    message.textContent = 'Access not granted!'       
})
