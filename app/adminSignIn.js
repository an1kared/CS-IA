const electron = require('electron');
const { ipcRenderer } = electron;


document.querySelector('.form').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Submit button clicked');
    // Fetch form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const adminKey = document.getElementById('key').value;
    const name = document.getElementById('name').value;
        // Send data to main process
    if (password === confirmPassword) {
        console.log('passwords match')
        data = 'newadmin@23'
        ipcRenderer.send('get:key', data)
        ipcRenderer.on('key', (event, key) => {
        confirmKey = key
        console.log(confirmKey)

        if (adminKey === confirmKey){
                console.log(adminKey)
                ipcRenderer.send('new:admin', { email, password, name });
                message.textContent = ''
                success.textContent = 'Submission successful!';
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
                document.getElementById('confirmPassword').value = '';
                document.getElementById('key').value = '';
                document.getElementById('name').value = '';
        }

        else{
            console.log("admin key is"+ adminKey)
            message.textContent = 'Wrong admin key'
            }

        })

    } else {
        console.log('dont match')
        message.textContent = 'Passwords do not match!';
    }
});
    
    