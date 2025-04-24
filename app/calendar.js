const{getConnection} = require('./database');
const con =  getConnection()


const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.send('open')

ipcRenderer.send('getUserId');




ipcRenderer.on('userId', (event, userId) => {
uid = userId
console.log('Received user ID:', uid);



const customEvents = []
con.connect(function (err) {
  if (err) throw err;
  con.query("SELECT * FROM taskmanager_electron.info WHERE userid = ?", [uid], function (err, result, fields) {
    if (err) throw err;
    if (result.length > 0) {
      result.forEach((res) => {
        customEvents.push({
          title: res.Name,
          start: new Date(res.duedate).toISOString(),
          end: new Date(res.duedate).toISOString(),
          extendedProps: {
            priority: res.Priority,
            time: res.TIME
          },
        });
      });
      initializeCalendar();
    }
  });
});

function initializeCalendar() {
  console.log('initialized');
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ['dayGrid', 'list', 'googleCalendar'],
    header: {
      left: 'prev, next, today',
      center: 'title',
      right: 'dayGridMonth, listYear',
      className: 'custom-header'
    },
    displayEventTime: false,
    events: customEvents,
   
    eventRender: function(info) {
      var event = info.event;
      info.el.style.color = 'FFFFFF'
  
      if (event.extendedProps.priority === 'High') {
        info.el.style.backgroundColor = 'FF407D';
      } else if (event.extendedProps.priority === 'Medium') {
        info.el.style.backgroundColor = 'FFC94A';
      } else if (event.extendedProps.priority === 'Low') {
        info.el.style.backgroundColor = '4CCD99';
      }
    },
  
    eventClick: function(arg) {
    
      var newTab = window.open(arg.event.url, '_blank', 'width=700, height=600');
      newTab.document.write(`
      <html>
        <head>
          <title>Event Details</title>
        <style>
          body {
            font-family:Times New Roman', Times, serif;
            padding: 20px;
          }

          h2 {
            color: #000000;
          }

          .event-details {
            margin-bottom: 20px;
            font-family: 'Times New Roman', Times, serif;
            color: 000000
          }

          .button {
            font-size: 15px;
            font-family: 'Times New Roman', Times, serif; 
            color: rgb(8, 8, 8);
            padding: 10px 20px;
            border-radius: 20px;
            background-color: #921bed;
            position: absolute;
            cursor: pointer;
          }

          .button:hover {
            background-color:#921bed;
          }

        </style>

      </head>

      <body>
        <h2>${arg.event.title}</h2>
        <div class="event-details">
          <p><strong>Start:</strong> ${arg.event.start.toLocaleString()}</p>
          <p><strong>Priority:</strong> ${arg.event.extendedProps.priority}</p>
          <p><strong>Time:</strong> ${arg.event.extendedProps.time}</p>
        </div>
      </body>
    `)
    
    newTab.document.write('<button type="button" id="button" class="button">Set Reminder</button>');

    // Code to send email when buttin is clicked
    var nodEmailer = require('nodemailer');
    newTab.document.querySelector('.button').addEventListener('click', async(event) =>{
      console.log("event has occured")
      //Establishing an SMTP connection
      var transporter = nodEmailer.createTransport({
        service:"Gmail",
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
          user: 'anikareddy.words@gmail.com',
          pass: 'jtva eyqq sxvn jmqg'
        },
        authMethod: 'PLAIN'       
      });

    console.log('authorization is done')

    let newEmail;

    ipcRenderer.send('getEmail')
    ipcRenderer.on('email', (event, email) => {
    console.log('recieved email', email)
    newEmail = email
    

    var mailOptions = {
    from: 'anikareddy.words@gmail.com',
    to: newEmail,
    subject: 'Reminder that task is due',
    html: `
          <p>This is a reminder to finish the following task:</p>
            <ul>
                <li><strong>Task:</strong> ${arg.event.title}</li>
                <li><strong>Duedate:</strong> ${arg.event.start.toLocaleString()}</li>
                <li><strong>Priority:</strong> ${arg.event.extendedProps.priority}</li>
                <li><strong>Time to complete:</strong>${arg.event.extendedProps.time}</li>
            </ul>`
            }

    console.log('sent email')
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);

    ipcRenderer.send("Notify")
  
  // Function to create and show a notification
  }
  })

  });
    
}) 
    arg.jsEvent.preventDefault();
  }

});

    calendar.render();
}
});



const Quill = require('quill');
const editor = new Quill('#editor', {
  theme: 'snow',
 
});
const toolbarContainer = document.querySelector('.ql-toolbar');
const saveButton = document.createElement('button');
saveButton.classList.add('ql-save-button');
saveButton.innerHTML = 'Save';
toolbarContainer.appendChild(saveButton);

saveButton.addEventListener('click', () => {
  const content = editor.root.innerHTML;
  ipcRenderer.send("text:notes", content)
})

ipcRenderer.on('text:display',(event, note) => {
  console.log('received text for display', note)
  
  editor.root.innerHTML = note
})