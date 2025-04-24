const electron = require('electron');
const { app, BrowserWindow, ipcMain, Notification } = electron;

require('./database')

var mySql = require('mysql2');
const { getConnection } = require('./database');
var connection = mySql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: "MSBiryani_1",
  database: 'taskmanager_electron'
});

connection.connect();

let mainWindow;
let addWindow;
let editWindow;

//function for creating the main window 
function createMainWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.webContents.openDevTools();
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createMainWindow);

// Executed when command is sent from taskmanager.js when add button is clicked
ipcMain.on("createAddWindow", async () => {
  console.log("Received createAddWindow message");
  createAddWindow();
});

//Function to create Add window
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Add New Task",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      menuIsEnabled: false,
    },
  });
  console.log("done");
  addWindow.loadFile("add.html");
  addWindow.on("closed", () => {
  addWindow = null;
  });
}

// Executed when command is sent from taskmanager.js when edit button is clicked
ipcMain.on("createEditWindow", (event, task) => {
  console.log("Received createEditWindow message", task);
  createEditWindow(task);
});

// Function to create Edit Window
function createEditWindow(task) {
  editWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Edit Task",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  editWindow.loadFile("edit.html");
  editWindow.webContents.send("task:edit", task);
  editWindow.on("closed", () => {
    editWindow = null;
  });
}



ipcMain.on("display:DeletedTask", async(event) => {
  mainWindow.loadFile('TaskManager.html')
})

//Code to update task data in the info data base

ipcMain.on("update-form-data", async (event, formData) => {


  console.log('Received submit message with data:', formData);
  try {
    console.log('Received signin:submit message with data:', formData);
    // establish connection with mysql database
    const connection = await mySql.createConnection({
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: "MSBiryani_1",
      database: 'taskmanager_electron'
    });
    console.log('Connected to the database');
    //updating task data
    const result = await connection.execute(`UPDATE info SET Name = ?,duedate = ?, Priority = ?,TIME = ? WHERE Id = ?`,
    [formData.name, formData.date,formData.priority,formData.time,formData.id]);
    console.log('Query result:', result);
    connection.end(); 
    //closing the window once task is updated
    mainWindow.loadFile('TaskManager.html')
    editWindow.close();
    
  } catch (error) {
    console.error('Error in signin:submit event handler:', error);
  }
});

var mySql = require("mysql2");
var connection = mySql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "MSBiryani_1",
  database: "taskmanager_electron",
});

connection.connect();


const bcrypt = require('bcrypt');
//Function to add task info to the database
ipcMain.on("task:add", async (event, formData) => {
  console.log('Received add message with data:', formData);

  try {
   
    const connection = await mySql.createConnection({
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: "MSBiryani_1",
      database: 'taskmanager_electron'
    });
    console.log('Connected to the database');
    console.log(userId)
    //inserting data into the table
    const result = await connection.execute('INSERT INTO info (Name, duedate, Priority, TIME, userid) VALUES (?,?,?,?,?)', 
    [formData.name, formData.date,formData.priority,formData.time,userId]);

    console.log('Query result:', result);
    mainWindow.loadFile('taskManager.html')
    addWindow.close();
    //closing window when action has been performed
    
    connection.end();
    
  } catch (error) {
    console.error('Error in signin:submit event handler:', error);
  }
});


const mySqlPromise = require('mysql2/promise');

ipcMain.on("text:notes", async (event, text) => {

  console.log('Received add message with data:', text);

  try {
    const connection = await mySqlPromise.createConnection({
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: "MSBiryani_1",
      database: 'taskmanager_electron'
    });

    const [rows] = await connection.query("SELECT * FROM notes WHERE userid=?", [userId]);
    if (rows.length > 0) {
      newText= text
      
      await connection.execute(`UPDATE notes SET notes = ? WHERE userid = ?`, [newText, userId]);
      event.reply('text:display', newText)
      console.log(text)
    } else {
     
      newtext= text
      await connection.execute('INSERT INTO notes (userid, notes) VALUES (?,?)', [userId, newText]);
      event.reply('text:display', newText)
    }

    notification = new Notification({  
      title: "Note saved",
      body: "Your note has been saved in the database"}).show()
      
    await connection.end(); // Close the connection after use
    
  } catch (error) {
    console.error('Error:', error);
  }
});


ipcMain.on("open", async (event) => {
  
    const connection = await mySqlPromise.createConnection({
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: "MSBiryani_1",
      database: 'taskmanager_electron'
    });
    const[result] = await connection.query(`SELECT * FROM notes where userid=?`, [userId])
    console.log(userId)
    console.log(result)
    const note = result[0].notes
    console.log(note)
    event.reply('text:display', note); // Send the message to the renderer process
    console.log(note);
    });

const { dialog } = require('electron');
class User{
  constructor(email,password, name,table){
    this.email = email;
    this.password = password;
    this.name = name;
    this.table = table;
  }

  async getConnection() {
    try {
      const connection = await mySql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: "MSBiryani_1",
        database: 'taskmanager_electron'
      });
      console.log('Connected to the database');
      return connection;
    } catch (error) {
      console.error('Error in getConnection:', error);
    }
  }


async signUp(data){
  try {
    
    const connection = await mySql.createConnection({
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: "MSBiryani_1",
      database: 'taskmanager_electron'
    });
    console.log('Connected to the database');
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);
    const result = await connection.execute(`INSERT INTO ${this.table} (email, password, name) VALUES (?, ?, ?)`, [this.email, hash, this.name]);
    console.log('Query result:', result);
    connection.end(); // Close the connection after use

  } catch (error) {
    console.error('Error in signin:submit event handler:', error);
  }
}
 
async logIn(mainWindow, data, event) {
  try {
    const connection = await mySql.createConnection({
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: "MSBiryani_1",
      database: 'taskmanager_electron'
    });

    const[rows] = await connection.query(`SELECT * FROM ${this.table} where email=?`, [this.email], function (error, rows, fields) {
      if (error) throw error;
      console.log(rows, 'rows', this.email, this.password)
     
      if (rows.length > 0) {
        const hash = rows[0].password;
        userId = rows[0].userid;
        email = rows[0].email;
  
      const plainPassword = data.password;
      
      const result = bcrypt.compareSync(plainPassword, hash);
      console.log(result);
      console.log(plainPassword)
      console.log(hash)
      
      if (result == true) {
        mainWindow.loadFile('home.html')}
       
      else {
        dialog.showErrorBox('Log in error', 'Incorrect Password');
      }
    }
    else{
      dialog.showErrorBox('Log in error', 'Incorrect Email');
    }
    connection.end();
  })
  
  }catch (error) {
    console.error('Error in login event handler:', error);
  }
}
}

let userId;

class Student extends User{
  constructor(email, password, name) {
    super(email, password, name, 'users');
  }}

let email;
class Admin extends User{
  constructor(email, password, name) {
    super(email, password, name,'admins');
  }
// establish connection with database
  async getConnection() {
    try {
      const connection = await mySql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: "MSBiryani_1",
        database: 'taskmanager_electron'
      });
      console.log('Connected to the database');
      return connection;
    } catch (error) {
      console.error('Error in getConnection:', error);
    }
  }
//function for signing up
  async signUp(data){
    try {
      const connection = await mySql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: "MSBiryani_1",
        database: 'taskmanager_electron'
      });
      //generating salt for hashing
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(data.password, salt);
      //inserting hashed password into database
      const result = await connection.execute(`INSERT INTO admins (email, password, name) VALUES (?, ?, ?)`, [this.email, hash, this.name]);
      console.log('Query result:', result);
      connection.end(); // Close the connection after use
    } catch (error) {
      console.error('Error in signin:submit event handler:', error);
    }
  }

  async logIn(mainWindow, data, event) {
    try {
      const connection = await mySql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: "MSBiryani_1",
        database: 'taskmanager_electron'
      });
      
      const[rows] = await connection.query(`SELECT * FROM ${this.table} where email=?`, [this.email], function (error, rows, fields) {
        if (error) throw error;
        console.log(rows, 'rows', this.email, this.password)
        if (rows.length > 0) {
          const hash = rows[0].password;
          const plainPassword = data.password;
          const result = bcrypt.compareSync(plainPassword, hash);
          console.log(result);
          console.log(plainPassword)
          console.log(hash)
        
        if (result == true) {
          mainWindow.loadFile('control.html')
        } else {
          dialog.showErrorBox('Log in error', 'Incorrect Password');
        }
      }
      else{
        dialog.showErrorBox('Log in error', 'Incorrect Email');
      }
      });
      connection.end();
    } catch (error) {
      console.error('Error in login event handler:', error);
    }
  
  }
}

ipcMain.on('signin:submit', async (event, data) => {
  console.log('Received submit message with data:', data);
  try {
    const student = new Student(data.email, data.password,data.name)
    await student.signUp(data);
  }
  catch(error){
    console.error('Error in signin:submit event handler:' ,error);
  }
});

ipcMain.on('login:submit', async (event, data) => {
  console.log("login received");
  try{
    const student = new Student(data.email, data.password, data.name);
    await student.logIn(mainWindow, data, event);
  }catch (error){
    console.error('error in login event handler', error);
  }
});

  ipcMain.on('new:admin', async(event, data) => {
    console.log("login receieved")
    try{
      const admin = new Admin(data.email, data.password, data.name);
      console.log('got data', data)
      await admin.signUp(data);
      console.log("admin sign in function initiated")
    } catch (error){
      console.error('new:Admin', event)
    }
  });

  ipcMain.on('admin:submit', async (event, data) => {
    console.log("login receieved")
    try {
        const admin = new Admin(data.email, data.password, data.name) 
        await admin.logIn(mainWindow, data, event);
    }catch (error){
        console.error('Error admin:submit', error)
    }
  });

ipcMain.on('getUserId', (event) => {
  console.log("Received")
    event.reply('userId', userId);
  });

ipcMain.on('getEmail',(event) => {
    event.reply('email', email)
    console.log(email)
  });

  ipcMain.on('getStudEmail',async(event, data) =>{
    console.log('sent')
    const connection = await mySqlPromise.createConnection({
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: "MSBiryani_1",
      database: 'taskmanager_electron'
    });


      const[rows] = await connection.query(`SELECT * FROM users where userid=?`, [data])
      if (rows.length > 0) {
        thisEmail = rows[0].email
        event.reply("email", thisEmail)
        console.log(thisEmail)
  
      }})

ipcMain.on('update:key',(async (event, cKey) => { 

  try{
    console.log('Received signin:submit message with data:', cKey);
    const connection = await mySql.createConnection({
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: "MSBiryani_1",
      database: 'taskmanager_electron'
      });
    console.log('Connected to the database');
    const result = await connection.execute(`UPDATE admins SET \`key\` =?`,[cKey]);
    console.log('Query result:', result);
    connection.end(); // Close the connection after use
    event.reply('key:updated')

  } catch (error) {
    console.error('Error in signin:submit event handler:', error);
  }
})
),

ipcMain.on('get:key',async(event, data) => {
  console.log("got key message")
  const connection = await mySql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: "MSBiryani_1",
    database: 'taskmanager_electron'
  });

    console.log(data)
  
    const[rows] = await connection.query(`SELECT * FROM admins where email=?`, [data], function (error, rows, fields) {
    if (error) throw error;
      console.log('rows are:', rows)

    if (rows.length > 0) {
      key = rows[0].key
      event.reply('key', key)
      console.log("key is", key)
      }
    })
  })



ipcMain.on("Notify",(event)=>{
  console.log("received notif")
  notification = new Notification({
  title: "Email sent",
  body: "Email has been sent"}).show()
})

let studentId
ipcMain.on("openCal", async(event, data)=>{
  mainWindow.loadFile('adminCalendar.html')
  studentId = data
  })

ipcMain.on('getStudentId', async(event)=>{
  event.reply("sentStudentId", studentId)
})

ipcMain.on('reloadDeleteAdmin', async(event)=>{
  mainWindow.loadFile("control.html")
})

module.exports = {
  createMainWindow,
};

