const mysql = require('mysql2')

const tasks = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : "MSBiryani_1",
    database : 'taskmanager_electron'


})
 


function getConnection(){
    return tasks
}

module.exports = {
    getConnection

}

var loginconnection = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : "MSBiryani_1",
    database : 'taskmanager_electron'
  });
  
  loginconnection.connect();
  loginconnection.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
  })