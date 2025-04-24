# TaskManager

TaskManager is a lightweight desktop application designed for students and study groups to efficiently manage tasks and deadlines.

Built with **React**, **Electron**, and **JavaScript**, this app allows users to:
- Add and delete tasks.
- Sort tasks by due date and importance.
- View tasks on an interactive calendar.
- Allow administrators to monitor individual calendars and send reminders.

---



## 💻 Technologies Used

- JavaScript
- HTML & CSS
- React
- Electron

---


## 🛠 Setup Instructions

1. Clone the repo.
2. Run `npm install` (if you're using Node).
3. Import `Database.sql` into your MySQL server.
4. Create a `config.js` file with your DB credentials:
   ```js
   module.exports = {
     host: 'localhost',
     user: 'your_user',
     password: 'your_password',
     database: 'task_manager'
   };
5. Run the app