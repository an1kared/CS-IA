const electron = require('electron');
const { ipcRenderer } = electron;

document.querySelector('.form').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Submit button clicked');
    // Fetch form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const name = document.getElementById('name').value

        // Send data to main process
        if (password === confirmPassword) {
        console.log('here')
        ipcRenderer.send('signin:submit', { email, password, name });
            message.textContent = ''
            success.textContent = 'Submission successful!';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('confirmPassword').value = '';
            document.getElementById('name').value = ''
          
        } else {
            message.textContent = 'Passwords do not match!';
        }
});
    