const ipcRenderer = require('electron').ipcRenderer;
const moment = require('moment');

ipcRenderer.send('getUserId');
console.log("Sent")

ipcRenderer.on('userId', (event, userId) =>{
  console.log("Receieved")
  uid = userId
  console.log('Received user ID:', userId);

const { getConnection } = require('./database');
const con = getConnection()
console.log(con)

con.connect(function (err) {
  if (err) throw err;
  con.query("SELECT * FROM taskmanager_electron.info WHERE userid = ?", [uid], function (err, result, fields) {
    if (err) throw err;
      if (result.length > 0) {
        renderTask(result);
        console.log(result)
    }
  });
});

class Node{
  constructor(task){
    this.task = task;
    this.next = null;
  }
}
class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  insert(task) {
    const newNode = new Node(task);

    // If the list is empty, simply add the new node as both head and tail
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    let current = this.head;
    let prev = null;
    // Traverse the list to find the correct position based on due date
    while (current && new Date(current.task.duedate) < new Date(task.duedate)) {
      prev = current;
      current = current.next;
    }
    // Adjust task priorities to numeric values
    switch (task.Priority) {
      case "High":
        task.Priority = 3;
        break;
      case "Medium":
        task.Priority = 2;
        break;
      case "Low":
        task.Priority = 1;
        break;
      default:
        task.Priority = 0; // Default to lowest priority
        break;
    }
    // If there are tasks due on the same date, sort them by priority
    while (current && new Date(current.task.duedate).getTime() === new Date(task.duedate).getTime()) {
      if (current.task.Priority < task.Priority) {
        break;
      }
      prev = current;
      current = current.next;
    }

    // Insert the new node at the correct position
    if (!prev) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      prev.next = newNode;
      newNode.next = current;
      if (!current) {
        this.tail = newNode;
      }
    }
  }

  // Other methods...
  convertPrioritiesToString() {
    let current = this.head;
    while (current) {
      this.convertPriorityToString(current.task);
      current = current.next;
    }
  }

  convertPriorityToString(task) {
    switch (task.Priority) {
      case 3:
        task.Priority = "High";
        break;
      case 2:
        task.Priority = "Medium";
        break;
      case 1:
        task.Priority = "Low";
        break;   
    }
  }
}

function renderTask(result) {
  console.log('Received task data:', result);
  const linkedList = new LinkedList();
  result.forEach(task => {
  linkedList.insert(task)
})

  let current = linkedList.head; // Start traversal from the head of the linked list
  console.log(current)
  while (current) {  
    console.log(current)
    const task = current.task;
    linkedList.convertPrioritiesToString();
    taskList.innerHTML += `
      <tr>
        <td>${task.Name}</td>
        <td>${moment(task.duedate).format("MMM-Do-YYYY")}</td>
        <td>${task.Priority}</td>
        <td>${task.TIME}</td>
        <td><button id="delBtn" class ="delBtn" data-id="${task.Id}" onclick="deleteTask(${task.Id})">Delete</button></td>
        <td><button id="edtBtn" class ="edtBtn" data-id="${task.Id}">Edit</button></td>
      </tr>
           `
      current = current.next
  }
  
  console.log(task.Priority)
}
  
document.addEventListener("DOMContentLoaded", function () {
  const taskList = document.getElementById('taskList');

  if (taskList) {
    taskList.addEventListener('click', (event) => {
      const target = event.target;

      if (target.tagName === 'BUTTON' && target.classList.contains('delBtn')) {
        const data = target.getAttribute('data-Id');
        deleteTask(data);
      }
      // Add similar logic for the edit button if needed
      if (target.tagName === 'BUTTON' && target.classList.contains('edtBtn')) {
        const data = target.getAttribute('data-Id');
        editTask(data);
      }
    });
  }
});

function deleteTask(data) {
  con.connect(function (err) {
    if (err) throw err;
    const response = confirm(
      "Are you sure you want to delete Task ?"
    );
    if (response) {
      con.query(
        "DELETE FROM taskmanager_electron.info where Id=?", [data],
        function (err, result, fields) {
          if (err) throw err;
        }
      );
    }
    ipcRenderer.send("display:DeletedTask");
  });
}

function editTask(data) {
  console.log(data, 'data')
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      "SELECT * FROM taskmanager_electron.info where Id=?",[data],
      function (err, result, fields) {
        if (err) throw err;
        ipcRenderer.send("createEditWindow", result);
      }
    );
  });
}

// const deleteBtn = document.querySelector('.delBtn');
// if (deleteBtn) {
//   deleteBtn.addEventListener('click', () => {
//     deleteTask(task.Id);
//   });
// }

// const editBtnId = document.querySelector('.edtBtn');
// if (editBtnId) {
//   editBtnId.addEventListener('click', () => {
//     editTask(task.Id);
//   });
// }
})
const createAddWindow = document.querySelector('.button');
createAddWindow.addEventListener('click', (event) => {
  console.log(event, 'Add Button')
  ipcRenderer.send('createAddWindow');  
});
