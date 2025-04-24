const{ getConnection } = require('./database');
const { ipcRenderer } = require('electron');
const moment = require('moment');
var editId;


// Listen for the 'populate-form' event from the main process
ipcRenderer.on('task:edit', (event, task) => {  
    console.log(task)  
    // Populate form fields with the received data    
    document.getElementById('name').value = task[0].Name || '';    
    document.getElementById("time").value = task[0].TIME || ''
    let dueDate = moment(task[0].duedate).format('YYYY-MM-DD')
    document.getElementById("duedate").value = dueDate || '';
    document.getElementById('priority').value = task[0].Priority || '';
    editId = task[0].Id
});

document.querySelector('.editForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        date: document.getElementById("duedate").value,
        priority: document.getElementById("priority").value,
        time: document.getElementById("time").value,
        id: editId
    };
  
    // Send the form data to the main process
    ipcRenderer.send('update-form-data', formData);
    
    console.log('sent edit task')
})