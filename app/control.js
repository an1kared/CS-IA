const ipcRenderer = require('electron').ipcRenderer;
const moment = require('moment');

defaultEmail = 'anikareddy236@gmail.com'
ipcRenderer.send('get:key', defaultEmail)

ipcRenderer.on('key', (event, key) => {  
  console.log('key') 
  console.log(key)
  document.getElementById('key').value = key
  
})

const { getConnection } = require('./database');
const con = getConnection()
console.log('gotten')
con.connect(function (err) {
  if (err) throw err;
  con.query("SELECT * FROM taskmanager_electron.admins", function (err, result, fields) {
    if (err) throw err;
    if (result.length > 0) {
      renderAdmin(result);
    }
  });
});


const getAdmin = async () => {
  admin = await main.getAdmin();
  renderAdmin(admin);
};



function renderAdmin(admin) {
  console.log('Received admin data:', admin);
  taskList.innerHTML = "";

  admin.forEach((admin) => {
    taskList.innerHTML += `
      <tr>
        <td>${admin.name}</td>
        <td>${admin.email}</td>
        <td><button id="delBtn" class ="delBtn" data-id="${admin.adminid}" onclick="deleteAdmin(${admin.adminid
      })">Delete</button></td>
      </tr>
        `;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const taskList = document.getElementById('taskList');

  if (taskList) {
    taskList.addEventListener('click', (event) => {
      const target = event.target;

      if (target.tagName === 'BUTTON' && target.classList.contains('delBtn')) {
        const data = target.getAttribute('data-Id');
        deleteAdmin(data);
      }
    
    });
  }
});

function deleteAdmin(data) {
  con.connect(function (err) {
    if (err) throw err;
    const response = confirm(
      "Are you sure you want to delete Admin Id ?"
    );
    if (response) {
      con.query(
        "DELETE FROM taskmanager_electron.admins where adminid =?",
        [data],
        function (err, result, fields) {
          if (err) throw err;
        }
      );
      ipcRenderer.send("reloadDeleteAdmin")
    }
  });
}

const deleteBtn = document.querySelector('.delBtn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
    // Assuming you have access to task.id here
    deleteAdmin(admin.adminid);
  });
}

con.connect(function (err) {
  if (err) throw err;
  con.query("SELECT * FROM taskmanager_electron.users", function (err, result, fields) {
    if (err) throw err;
    if (result.length > 0) {
      renderUser(result);
    }
  });
});


const getUser = async () => {
  user = await main.getUser(user);
  renderUser(user);
};

function renderUser(user) {
  console.log('Received user data:', user);
  userList.innerHTML = "";

  user.forEach((user) => {
    userList.innerHTML += `
      <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td><button id="dBtn" class ="delBtn" data-id="${user.userid}" onclick="deleteUser(${user.userid})">Delete</button></td>
        <td><button id="calBtn" class ="calBtn" data-id="${user.userid}" onclick="viewCalendar(${user.userid})">View Calendar</button></td>
      </tr>`});
}

document.addEventListener("DOMContentLoaded", function () {
  const userList = document.getElementById('userList');

  if (userList) {
    userList.addEventListener('click', (event) => {
      const target = event.target;

      if (target.tagName === 'BUTTON' && target.classList.contains('delBtn')) {
        const data = target.getAttribute('data-Id');
        deleteUser(data);
      }

      if (target.tagName === 'BUTTON' && target.classList.contains('calBtn')) {
        const data = target.getAttribute('data-Id');
        console.log(data)
        viewCalendar(data);
      }    
    });
  }
});

function deleteUser(data) {
  con.connect(function (err) {
    if (err) throw err;
    const response = confirm(
      "Are you sure you want to delete User ?"
    );
    if (response) {
      con.query(
        "DELETE FROM taskmanager_electron.users where userid =?",
        [data],
        console.log('sent'),
        function (err, result, fields) {
          if (err) throw err;
        }
      );
      ipcRenderer.send("reloadDeleteAdmin")
    }
  });
}
function viewCalendar(data) {
  con.connect(function (err) {
    if (err) throw err;
    const response = confirm(
      "Are you sure you want to View Calendar ?"
    );
    if (response) {
      ipcRenderer. send('openCal', data)
      console.log('sent Open Cal')
      }
      
  })
}



const dBtn = document.querySelector('.dBtn');
if (dBtn) {
  dBtn.addEventListener('click', () => {
    // Assuming you have access to task.id here
    deleteUser(user.userid);
  });
}



document.querySelector('.set').addEventListener('click', async (event) => {
  event.preventDefault();
  const cKey = document.getElementById('key').value
  ipcRenderer.send('update:key', cKey)
  console.log('sent key')

ipcRenderer.on ('key:updated', (event) =>{
  message.textContent = 'key has been changed'
})

})
