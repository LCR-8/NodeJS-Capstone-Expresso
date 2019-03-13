const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const logErr = (err, source) => {
  console.log(">>> migration.js error >> ", source, " ", err);
}

db.serialize(() => {
//TABLES creation
  db.run("create table IF NOT EXISTS Employee (id Integer PRIMARY KEY NOT NULL," +
         "                     name Text NOT NULL," +
         "                     position Text NOT NULL," +
         "                     wage Integer NOT NULL," +
         "                     is_current_employee INTEGER DEFAULT 1);", err => {
           if (err){
             logErr(err, 'Create Employee table');
             throw err;
           }
         });

  db.run("create table IF NOT EXISTS Timesheet (id Integer PRIMARY KEY NOT NULL," +
         "                     hours Integer NOT NULL," +
         "                     rate Integer NOT NULL," +
         "                     date Integer NOT NULL," +
         "                     employee_id Integer NOT NULL," +
         "                     FOREIGN KEY(employee_id) REFERENCES Employee(id));", err => {
           if (err){
             logErr(err, 'Create Timesheet table');
             throw err;
           }
         });

  db.run("create table IF NOT EXISTS Menu (id Integer PRIMARY KEY NOT NULL," +
         "                    title Text NOT NULL);", err => {
           if (err){
             logErr(err, 'Create Menu table');
             throw err;
           }
         });

  db.run("create table IF NOT EXISTS MenuItem (id Integer PRIMARY KEY NOT NULL," +
         "                     name Text NOT NULL," +
         "                     description Text," +
         "                     inventory Integer NOT NULL," +
         "                     price Integer NOT NULL," +
         "                     menu_id Integer NOT NULL," +
         "                     FOREIGN KEY(menu_id) REFERENCES Menu(id));", err => {
           if (err){
             logErr(err, 'Create MenuItem table');
             throw err;
           }
         });
});
