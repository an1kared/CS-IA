const { ipcRenderer } = require('electron');
ipcRenderer.send('getUserId');
ipcRenderer.on('userId', (event, userId) => {
uid = userId
console.log('Received user ID:', userId);
});
document.querySelector('.addform').addEventListener('submit', async (event) => {
event.preventDefault(); // Prevent the default form submission behavior
// Collect form data
const formData = {
name: document.getElementById('name').value,
date: document.getElementById("duedate").value,
priority: document.getElementById("priority").value,
time: document.getElementById("time").value,
userid: uid,
}
// Send the form data to the main process
ipcRenderer.send('task:add', formData);
console.log('sent add task')
})